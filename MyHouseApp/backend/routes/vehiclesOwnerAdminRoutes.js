import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET all vehicles with owner details for admin view
router.get('/vehicles/owners', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';

    // Get column names for both tables to build dynamic query
    const [detCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'vehiclesowndet'`,
      [dbName]
    );
    
    const [vehCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'vehiclesdet'`,
      [dbName]
    );

    if (detCols.length === 0 || vehCols.length === 0) {
      return res.status(200).json([]);
    }

    const detColumnNames = detCols.map(c => c.COLUMN_NAME.toLowerCase());
    const vehColumnNames = vehCols.map(c => c.COLUMN_NAME.toLowerCase());

    const findCol = (columnNames, candidates) => {
      for (const cand of candidates) {
        const found = columnNames.find(col => col.includes(cand.toLowerCase()));
        if (found) return found;
      }
      return null;
    };

    const detPk = findCol(detColumnNames, ['id', 'vo_no', 'vono']) || 'id';
    const vehFk = findCol(vehColumnNames, ['vehiclesowndet_id', 'vo_no', 'vono', 'owner_id', 'id']) || 'vehiclesowndet_id';
    console.log(`[Admin Vehicle Route] Joining keys - Owner PK: ${detPk}, Vehicle FK: ${vehFk}`);
    
    const nameCol = findCol(detColumnNames, ['name', 'person', 'owner']);
    const contactCol = findCol(detColumnNames, ['contact', 'phone', 'phno']);
    const areaCol = findCol(detColumnNames, ['area', 'location']);
    const cityCol = findCol(detColumnNames, ['city']);
    const streetCol = findCol(detColumnNames, ['street', 'address']);
    const doorNoCol = findCol(detColumnNames, ['door', 'no']);
    const pinCol = findCol(detColumnNames, ['pin', 'pincode', 'postal']);

    const typeCol = findCol(vehColumnNames, ['type', 'vehicle_type']);
    const modelCol = findCol(vehColumnNames, ['model', 'vehicle_model']);
    const vNameCol = findCol(vehColumnNames, ['name', 'vehicle_name']);
    const seatsCol = findCol(vehColumnNames, ['seat', 'capacity']);
    const fuelCol = findCol(vehColumnNames, ['fuel']);
    const acDayCol = findCol(vehColumnNames, ['ac_charge_per_day', 'ac_day']);
    const acKmCol = findCol(vehColumnNames, ['ac_charge_per_km', 'ac_km']);
    const acWaitHrCol = findCol(vehColumnNames, ['ac_waiting_charge_per_hour', 'ac_wait_hour']);
    const acWaitNightCol = findCol(vehColumnNames, ['ac_waiting_charge_per_night', 'ac_wait_night']);
    const acFixedCol = findCol(vehColumnNames, ['ac_fixed']);
    const nonAcDayCol = findCol(vehColumnNames, ['nonac_charge_per_day', 'nonac_day']);
    const nonAcKmCol = findCol(vehColumnNames, ['nonac_charge_per_km', 'nonac_km']);
    const nonAcWaitHrCol = findCol(vehColumnNames, ['nonac_waiting_charge_per_hour', 'nonac_wait_hour']);
    const nonAcWaitNightCol = findCol(vehColumnNames, ['nonac_waiting_charge_per_night', 'nonac_wait_night']);
    const nonAcFixedCol = findCol(vehColumnNames, ['nonac_fixed']);
    const imgCol = findCol(vehColumnNames, ['image', 'vehicle_images']);
    const createdCol = findCol(vehColumnNames, ['created_at']) || 'id';

    const query = `
      SELECT 
        vo.${detPk} as ownerId,
        vo.${nameCol} as ownerName,
        vo.${contactCol} as contactNo,
        vo.${areaCol} as area,
        vo.${cityCol} as city,
        vo.${streetCol} as street,
        vo.${doorNoCol} as doorNo,
        vo.${pinCol} as pincode,
        vd.id as vehicleId,
        vd.${typeCol} as type,
        vd.${vNameCol} as name,
        vd.${modelCol} as model,
        vd.${seatsCol} as seatCapacity,
        vd.${fuelCol} as fuelType,
        vd.${acDayCol} as acChargePerDay,
        vd.${acKmCol} as acChargePerKm,
        vd.${acWaitHrCol} as acWaitPerHour,
        vd.${acWaitNightCol} as acWaitPerNight,
        vd.${acFixedCol} as acFixed,
        vd.${nonAcDayCol} as nonAcChargePerDay,
        vd.${nonAcKmCol} as nonAcChargePerKm,
        vd.${nonAcWaitHrCol} as nonAcWaitPerHour,
        vd.${nonAcWaitNightCol} as nonAcWaitPerNight,
        vd.${nonAcFixedCol} as nonAcFixed,
        vd.${imgCol} as images
      FROM vehiclesdet vd
      INNER JOIN vehiclesowndet vo ON vd.${vehFk} = vo.${detPk}
      ORDER BY vd.${createdCol} DESC
    `;

    const [rows] = await pool.execute(query);

    if (rows.length === 0) {
      return res.status(200).json([]);
    }

    const vehicles = rows.map(row => ({
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || [])
    }));

    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles owners:', error);
    res.status(500).json({ message: 'Error fetching vehicles owners', error: error.message });
  }
});

export default router;
