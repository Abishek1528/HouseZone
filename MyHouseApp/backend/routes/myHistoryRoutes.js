import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

const normalizePhone = (value) => {
  if (value == null) return '';
  return String(value).replace(/\D/g, '').slice(-10);
};

const phoneMatchSql = (column) =>
  `RIGHT(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(${column}, ''), ' ', ''), '-', ''), '+', ''), '.', ''), 10) = ?`;

const findTableContactColumn = async (tableName) => {
  const dbName = process.env.DB_NAME || 'cdmrental';
  const [cols] = await pool.execute(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [dbName, tableName]
  );
  const columnNames = cols.map((c) => c.COLUMN_NAME);
  const lower = columnNames.map((c) => c.toLowerCase());

  const candidates = ['contact_number', 'contact_no', 'contactno', 'rophno', 'phone', 'phno'];
  for (const cand of candidates) {
    const idx = lower.findIndex((c) => c === cand || c.includes(cand));
    if (idx >= 0) return columnNames[idx];
  }

  const fuzzyIdx = lower.findIndex((c) => c.includes('contact') || c.includes('phone') || c.includes('ph'));
  return fuzzyIdx >= 0 ? columnNames[fuzzyIdx] : null;
};

// GET bookings + owner listings for logged-in user (matched by account contact number)
router.get('/my-history', async (req, res) => {
  try {
    const contact = normalizePhone(req.query.contact);
    const userId = req.query.userId ? Number(req.query.userId) : null;

    if (!contact || contact.length !== 10) {
      return res.status(400).json({
        message: 'A valid 10-digit contact number is required. Please log in again.',
      });
    }

    let accountName = null;
    if (userId) {
      const [users] = await pool.execute(
        'SELECT id, name, contact_number FROM signup WHERE id = ? LIMIT 1',
        [userId]
      );
      if (users.length > 0) {
        accountName = users[0].name;
        const dbContact = normalizePhone(users[0].contact_number);
        if (dbContact && dbContact !== contact) {
          console.warn('My history contact mismatch', { userId, queryContact: contact, dbContact });
        }
      }
    }

    const history = [];

    const [residentialRows] = await pool.execute(
      `SELECT
        rt.id AS bookingId,
        rt.name AS tenantName,
        rt.job,
        rt.salary_per_month AS salary,
        rt.native_place AS nativePlace,
        rt.current_address AS currentAddress,
        rt.mobile_number AS mobileNumber,
        rt.alternate_number AS alternateNumber,
        rd.roNo AS propertyId,
        rd.roArea AS area,
        rd.roCity AS city,
        rd.roStreet AS street,
        rd.roDoor AS doorNo,
        rh.number_of_bedrooms AS bedrooms,
        rh.facing_direction AS facingDirection,
        rp.monthly_rent AS rent,
        rp.advance_amount AS advance,
        rp.lease_amount AS leaseAmount
      FROM restenant rt
      LEFT JOIN resowndet rd ON rt.roNo = rd.roNo
      LEFT JOIN resownho rh ON rd.roNo = rh.roNo
      LEFT JOIN resownpay rp ON rd.roNo = rp.roNo
      WHERE ${phoneMatchSql('rt.mobile_number')}
         OR ${phoneMatchSql('rt.alternate_number')}
      ORDER BY rt.id DESC`,
      [contact, contact]
    );

    residentialRows.forEach((row) => {
      history.push({
        recordId: row.bookingId,
        bookingId: row.bookingId,
        activityType: 'booking',
        category: 'residential',
        type: 'House Booking',
        tenantName: row.tenantName,
        job: row.job,
        salary: row.salary,
        nativePlace: row.nativePlace,
        currentAddress: row.currentAddress,
        mobileNumber: row.mobileNumber,
        propertyId: row.propertyId,
        title: row.bedrooms ? `${row.bedrooms} BHK House` : 'Residential House',
        subtitle: [row.doorNo, row.street, row.area, row.city].filter(Boolean).join(', ') || row.area || 'Residential property',
        rent: row.rent,
        advance: row.advance,
        leaseAmount: row.leaseAmount,
        bedrooms: row.bedrooms,
        facingDirection: row.facingDirection,
      });
    });

    const [businessRows] = await pool.execute(
      `SELECT
        bt.id AS bookingId,
        bt.name AS tenantName,
        bt.job,
        bt.salary_per_month AS salary,
        bt.native_place AS nativePlace,
        bt.current_address AS currentAddress,
        bt.mobile_number AS mobileNumber,
        bt.alternate_number AS alternateNumber,
        bd.id AS propertyId,
        bd.area,
        bd.city,
        bd.street,
        bd.door_no AS doorNo,
        bp.property_type AS propertyType,
        bp.door_facing AS facingDirection,
        br.monthly_rent AS rent,
        br.advance_amount AS advance,
        br.lease_amount AS leaseAmount
      FROM buitenant bt
      LEFT JOIN businessownerdet bd ON bt.boNo = bd.id
      LEFT JOIN businessownerpro bp ON bd.id = bp.businessownerdet_id
      LEFT JOIN businessownerrent br ON bd.id = br.businessownerdet_id
      WHERE ${phoneMatchSql('bt.mobile_number')}
         OR ${phoneMatchSql('bt.alternate_number')}
      ORDER BY bt.id DESC`,
      [contact, contact]
    );

    businessRows.forEach((row) => {
      history.push({
        recordId: row.bookingId,
        bookingId: row.bookingId,
        activityType: 'booking',
        category: 'business',
        type: 'Business Space Booking',
        tenantName: row.tenantName,
        job: row.job,
        salary: row.salary,
        nativePlace: row.nativePlace,
        currentAddress: row.currentAddress,
        mobileNumber: row.mobileNumber,
        propertyId: row.propertyId,
        title: row.propertyType ? `${row.propertyType} Space` : 'Business Property',
        subtitle: [row.doorNo, row.street, row.area, row.city].filter(Boolean).join(', ') || row.area || 'Business property',
        rent: row.rent,
        advance: row.advance,
        leaseAmount: row.leaseAmount,
        propertyType: row.propertyType,
        facingDirection: row.facingDirection,
      });
    });

    const [vehicleRows] = await pool.execute(
      `SELECT
        vt.id AS bookingId,
        vt.name AS tenantName,
        vt.job,
        vt.salary_per_month AS salary,
        vt.native_place AS nativePlace,
        vt.current_address AS currentAddress,
        vt.mobile_number AS mobileNumber,
        vt.alternate_number AS alternateNumber,
        vd.id AS propertyId,
        vd.vehicle_name AS itemName,
        vd.vehicle_type AS itemType,
        vd.vehicle_model AS model,
        vd.ac_charge_per_day AS rent,
        vo.area,
        vo.city
      FROM vehtenant vt
      LEFT JOIN vehiclesdet vd ON vt.voNo = vd.id
      LEFT JOIN vehiclesowndet vo ON vd.vehiclesowndet_id = vo.id
      WHERE ${phoneMatchSql('vt.mobile_number')}
         OR ${phoneMatchSql('vt.alternate_number')}
      ORDER BY vt.id DESC`,
      [contact, contact]
    );

    vehicleRows.forEach((row) => {
      history.push({
        recordId: row.bookingId,
        bookingId: row.bookingId,
        activityType: 'booking',
        category: 'vehicles',
        type: 'Vehicle Booking',
        tenantName: row.tenantName,
        job: row.job,
        salary: row.salary,
        nativePlace: row.nativePlace,
        currentAddress: row.currentAddress,
        mobileNumber: row.mobileNumber,
        propertyId: row.propertyId,
        title: row.itemName || 'Vehicle',
        subtitle: [row.itemType, row.model, row.area, row.city].filter(Boolean).join(' • ') || 'Vehicle rental',
        rent: row.rent,
        itemType: row.itemType,
        model: row.model,
      });
    });

    const [machineryRows] = await pool.execute(
      `SELECT
        mt.id AS bookingId,
        mt.name AS tenantName,
        mt.job,
        mt.salary_per_month AS salary,
        mt.native_place AS nativePlace,
        mt.current_address AS currentAddress,
        mt.mobile_number AS mobileNumber,
        mt.alternate_number AS alternateNumber,
        md.owner_id AS propertyId,
        md.machinery_name AS itemName,
        md.machinery_type AS itemType,
        md.machinery_model AS model,
        md.charge_per_day AS rent,
        mo.area,
        mo.city
      FROM mactenant mt
      LEFT JOIN machinarydet md ON mt.moNo = md.owner_id
      LEFT JOIN machinaryowndet mo ON md.owner_id = mo.id
      WHERE ${phoneMatchSql('mt.mobile_number')}
         OR ${phoneMatchSql('mt.alternate_number')}
      ORDER BY mt.id DESC`,
      [contact, contact]
    );

    machineryRows.forEach((row) => {
      history.push({
        recordId: row.bookingId,
        bookingId: row.bookingId,
        activityType: 'booking',
        category: 'machinery',
        type: 'Machinery Booking',
        tenantName: row.tenantName,
        job: row.job,
        salary: row.salary,
        nativePlace: row.nativePlace,
        currentAddress: row.currentAddress,
        mobileNumber: row.mobileNumber,
        propertyId: row.propertyId,
        title: row.itemName || 'Machinery',
        subtitle: [row.itemType, row.model, row.area, row.city].filter(Boolean).join(' • ') || 'Machinery rental',
        rent: row.rent,
        itemType: row.itemType,
        model: row.model,
      });
    });

    // --- Owner listings (submitted owner forms) ---

    const [residentialOwnerRows] = await pool.execute(
      `SELECT
        rd.roNo AS recordId,
        rd.roName AS ownerName,
        rd.roDoor AS doorNo,
        rd.roStreet AS street,
        rd.roArea AS area,
        rd.roCity AS city,
        rd.roPhNo AS contactNo,
        rh.number_of_bedrooms AS bedrooms,
        rh.facing_direction AS facingDirection,
        rp.monthly_rent AS rent,
        rp.advance_amount AS advance,
        rp.lease_amount AS leaseAmount
      FROM resowndet rd
      LEFT JOIN resownho rh ON rd.roNo = rh.roNo
      LEFT JOIN resownpay rp ON rd.roNo = rp.roNo
      WHERE ${phoneMatchSql('rd.roPhNo')}
      ORDER BY rd.roNo DESC`,
      [contact]
    );

    residentialOwnerRows.forEach((row) => {
      history.push({
        recordId: row.recordId,
        activityType: 'listing',
        category: 'residential',
        type: 'House Listed (Owner)',
        ownerName: row.ownerName,
        contactNo: row.contactNo,
        propertyId: row.recordId,
        title: row.bedrooms ? `${row.bedrooms} BHK House Listed` : 'Residential House Listed',
        subtitle: [row.doorNo, row.street, row.area, row.city].filter(Boolean).join(', ') || row.area || 'Your listed property',
        rent: row.rent,
        advance: row.advance,
        leaseAmount: row.leaseAmount,
        bedrooms: row.bedrooms,
        facingDirection: row.facingDirection,
      });
    });

    const businessContactCol = await findTableContactColumn('businessownerdet');
    if (businessContactCol) {
      const [businessOwnerRows] = await pool.execute(
        `SELECT
          bd.id AS recordId,
          bd.name_of_person AS ownerName,
          bd.door_no AS doorNo,
          bd.street,
          bd.area,
          bd.city,
          bd.${businessContactCol} AS contactNo,
          bp.property_type AS propertyType,
          bp.door_facing AS facingDirection,
          br.monthly_rent AS rent,
          br.advance_amount AS advance,
          br.lease_amount AS leaseAmount
        FROM businessownerdet bd
        LEFT JOIN businessownerpro bp ON bd.id = bp.businessownerdet_id
        LEFT JOIN businessownerrent br ON bd.id = br.businessownerdet_id
        WHERE ${phoneMatchSql(`bd.${businessContactCol}`)}
        ORDER BY bd.id DESC`,
        [contact]
      );

      businessOwnerRows.forEach((row) => {
        history.push({
          recordId: row.recordId,
          activityType: 'listing',
          category: 'business',
          type: 'Business Space Listed (Owner)',
          ownerName: row.ownerName,
          contactNo: row.contactNo,
          propertyId: row.recordId,
          title: row.propertyType ? `${row.propertyType} Space Listed` : 'Business Property Listed',
          subtitle: [row.doorNo, row.street, row.area, row.city].filter(Boolean).join(', ') || row.area || 'Your listed business space',
          rent: row.rent,
          advance: row.advance,
          leaseAmount: row.leaseAmount,
          propertyType: row.propertyType,
          facingDirection: row.facingDirection,
        });
      });
    }

    const vehicleContactCol = await findTableContactColumn('vehiclesowndet');
    if (vehicleContactCol) {
      const [vehicleOwnerRows] = await pool.execute(
        `SELECT
          vo.id AS recordId,
          vo.name_of_person AS ownerName,
          vo.door_no AS doorNo,
          vo.street,
          vo.area,
          vo.city,
          vo.${vehicleContactCol} AS contactNo,
          COUNT(vd.id) AS itemCount
        FROM vehiclesowndet vo
        LEFT JOIN vehiclesdet vd ON vd.vehiclesowndet_id = vo.id
        WHERE ${phoneMatchSql(`vo.${vehicleContactCol}`)}
        GROUP BY vo.id, vo.name_of_person, vo.door_no, vo.street, vo.area, vo.city, vo.${vehicleContactCol}
        ORDER BY vo.id DESC`,
        [contact]
      );

      vehicleOwnerRows.forEach((row) => {
        const count = Number(row.itemCount) || 0;
        history.push({
          recordId: row.recordId,
          activityType: 'listing',
          category: 'vehicles',
          type: 'Vehicle(s) Listed (Owner)',
          ownerName: row.ownerName,
          contactNo: row.contactNo,
          propertyId: row.recordId,
          title: count > 0 ? `${count} Vehicle(s) Listed` : 'Vehicle Owner Registration',
          subtitle: [row.area, row.city].filter(Boolean).join(', ') || 'Your vehicle listing',
          itemCount: count,
        });
      });
    }

    const machineryContactCol = await findTableContactColumn('machinaryowndet');
    if (machineryContactCol) {
      const [machineryOwnerRows] = await pool.execute(
        `SELECT
          mo.id AS recordId,
          mo.person_name AS ownerName,
          mo.area,
          mo.city,
          mo.${machineryContactCol} AS contactNo,
          COUNT(md.owner_id) AS itemCount
        FROM machinaryowndet mo
        LEFT JOIN machinarydet md ON md.owner_id = mo.id
        WHERE ${phoneMatchSql(`mo.${machineryContactCol}`)}
        GROUP BY mo.id, mo.person_name, mo.area, mo.city, mo.${machineryContactCol}
        ORDER BY mo.id DESC`,
        [contact]
      );

      machineryOwnerRows.forEach((row) => {
        const count = Number(row.itemCount) || 0;
        history.push({
          recordId: row.recordId,
          activityType: 'listing',
          category: 'machinery',
          type: 'Machinery Listed (Owner)',
          ownerName: row.ownerName,
          contactNo: row.contactNo,
          propertyId: row.recordId,
          title: count > 0 ? `${count} Machinery Item(s) Listed` : 'Machinery Owner Registration',
          subtitle: [row.area, row.city].filter(Boolean).join(', ') || 'Your machinery listing',
          itemCount: count,
        });
      });
    }

    history.sort((a, b) => (b.recordId || b.bookingId || 0) - (a.recordId || a.bookingId || 0));

    const bookingCount = history.filter((h) => h.activityType === 'booking').length;
    const listingCount = history.filter((h) => h.activityType === 'listing').length;

    res.status(200).json({
      accountName,
      contact,
      total: history.length,
      bookingCount,
      listingCount,
      bookings: history,
    });
  } catch (error) {
    console.error('Error fetching my history:', error);
    res.status(500).json({
      message: 'Error fetching booking history',
      error: error.message,
    });
  }
});

export default router;
