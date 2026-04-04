import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// API endpoint for saving new tenant details to the restenant table
router.post('/residential/new-tenant-details', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      tenant_name,
      job,
      salary,
      native_place,
      current_address,
      mobile_number,
      alternate_number
    } = req.body;

    // Insert tenant details into the restenant table
    const [result] = await connection.execute(
      `INSERT INTO restenant (
        name, job, salary_per_month, native_place, current_address, mobile_number, alternate_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
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
      message: 'Tenant details saved successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error saving new tenant details:', error);
    res.status(500).json({ message: 'Error saving tenant details', error: error.message });
  } finally {
    connection.release();
  }
});

export default router;
