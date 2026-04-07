import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// API endpoint for saving new tenant details to the category-specific tenant tables
router.post('/residential/new-tenant-details', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      roNo,
      category,
      tenant_name,
      job,
      salary,
      native_place,
      current_address,
      mobile_number,
      alternate_number
    } = req.body;

    // Map categories to table names and ID column names
    const categoryConfig = {
      residential: { table: 'restenant', idCol: 'roNo' },
      business: { table: 'buitenant', idCol: 'boNo' },
      machinery: { table: 'mactenant', idCol: 'moNo' },
      vehicles: { table: 'vehtenant', idCol: 'voNo' }
    };

    const config = categoryConfig[category] || categoryConfig.residential;

    // Insert tenant details into the appropriate table
    const sql = `INSERT INTO ${config.table} (
        ${config.idCol}, name, job, salary_per_month, native_place, current_address, mobile_number, alternate_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await connection.execute(sql, [
        roNo || null,
        tenant_name,
        job,
        parseFloat(salary) || 0,
        native_place,
        current_address,
        mobile_number,
        alternate_number || null
      ]
    );

    await connection.commit();

    res.status(201).json({
      id: result.insertId,
      message: `${category.charAt(0).toUpperCase() + category.slice(1)} tenant details saved successfully`
    });
  } catch (error) {
    await connection.rollback();
    console.error(`Error saving new ${req.body.category || 'tenant'} details:`, error);
    res.status(500).json({ message: 'Error saving tenant details', error: error.message });
  } finally {
    connection.release();
  }
});

// API endpoint for admin to get all tenants with their associated property details
router.get('/admin/residential/tenants-with-properties', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        rt.id as tenantId,
        rt.name as tenantName,
        rt.job,
        rt.salary_per_month as salary,
        rt.native_place as nativePlace,
        rt.current_address as currentAddress,
        rt.mobile_number as mobileNumber,
        rt.alternate_number as alternateNumber,
        rd.roNo as propertyId,
        rd.roArea as area,
        rd.roCity as city,
        rd.roStreet as street,
        rd.roDoor as doorNo,
        rh.number_of_bedrooms as bedrooms,
        rh.facing_direction as facingDirection,
        rp.monthly_rent as rent,
        rp.advance_amount as advance
      FROM restenant rt
      LEFT JOIN resowndet rd ON rt.roNo = rd.roNo
      LEFT JOIN resownho rh ON rd.roNo = rh.roNo
      LEFT JOIN resownpay rp ON rd.roNo = rp.roNo
      ORDER BY rt.id DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching tenants with properties:', error);
    res.status(500).json({ message: 'Error fetching details', error: error.message });
  }
});

// API endpoint for admin to get all business tenants with their associated property details
router.get('/admin/business/tenants-with-properties', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        bt.id as tenantId,
        bt.name as tenantName,
        bt.job,
        bt.salary_per_month as salary,
        bt.native_place as nativePlace,
        bt.current_address as currentAddress,
        bt.mobile_number as mobileNumber,
        bt.alternate_number as alternateNumber,
        bd.id as propertyId,
        bd.area,
        bd.city,
        bd.street,
        bd.door_no as doorNo,
        bp.property_type as propertyType,
        bp.door_facing as facingDirection,
        br.monthly_rent as rent,
        br.advance_amount as advance
      FROM buitenant bt
      LEFT JOIN businessownerdet bd ON bt.boNo = bd.id
      LEFT JOIN businessownerpro bp ON bd.id = bp.businessownerdet_id
      LEFT JOIN businessownerrent br ON bd.id = br.businessownerdet_id
      ORDER BY bt.id DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching business tenants:', error);
    res.status(500).json({ message: 'Error fetching business details', error: error.message });
  }
});

// API endpoint for admin to get all machinery tenants with their associated item details
router.get('/admin/machinery/tenants-with-items', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        mt.id as tenantId,
        mt.name as tenantName,
        mt.job,
        mt.salary_per_month as salary,
        mt.native_place as nativePlace,
        mt.current_address as currentAddress,
        mt.mobile_number as mobileNumber,
        mt.alternate_number as alternateNumber,
        md.owner_id as propertyId,
        md.machinery_name as itemName,
        md.machinery_type as itemType,
        md.machinery_model as model,
        md.charge_per_day as rent
      FROM mactenant mt
      LEFT JOIN machinarydet md ON mt.moNo = md.owner_id
      ORDER BY mt.id DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching machinery tenants:', error);
    res.status(500).json({ message: 'Error fetching machinery details', error: error.message });
  }
});

// API endpoint for admin to get all vehicle tenants with their associated item details
router.get('/admin/vehicles/tenants-with-items', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        vt.id as tenantId,
        vt.name as tenantName,
        vt.job,
        vt.salary_per_month as salary,
        vt.native_place as nativePlace,
        vt.current_address as currentAddress,
        vt.mobile_number as mobileNumber,
        vt.alternate_number as alternateNumber,
        vd.id as propertyId,
        vd.vehicle_name as itemName,
        vd.vehicle_type as itemType,
        vd.vehicle_model as model,
        vd.ac_charge_per_day as rent
      FROM vehtenant vt
      LEFT JOIN vehiclesdet vd ON vt.voNo = vd.id
      ORDER BY vt.id DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching vehicle tenants:', error);
    res.status(500).json({ message: 'Error fetching vehicle details', error: error.message });
  }
});

export default router;
