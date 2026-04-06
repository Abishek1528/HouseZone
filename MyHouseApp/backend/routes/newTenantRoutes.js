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

export default router;
