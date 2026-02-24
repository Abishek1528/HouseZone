import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// Save business step 1 details into existing businessownerdet table
router.post('/business/step1', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';
    const tableName = 'businessownerdet';

    const payload = req.body || {};

    // Fetch columns for the target table
    const [cols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [dbName, tableName]
    );

    const columnNames = cols.map(c => c.COLUMN_NAME.toLowerCase());

    // Helper to find a column by possible name fragments
    const findCol = (candidates) => {
      for (const cand of candidates) {
        const found = columnNames.find(col => col.includes(cand.toLowerCase()));
        if (found) return found;
      }
      return null;
    };

    const mappings = {
      name: findCol(['name', 'owner', 'bo_name', 'boname']),
      doorNo: findCol(['door', 'doorno']),
      street: findCol(['street', 'address']),
      pincode: findCol(['pin', 'pincode', 'postal', 'zipcode']),
      area: findCol(['area', 'locality']),
      city: findCol(['city']),
      contactNo: findCol(['phone', 'phno', 'contact', 'ph'])
    };

    // Build insert columns and values
    const insertCols = [];
    const insertVals = [];

    for (const [key, col] of Object.entries(mappings)) {
      if (col && payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
        insertCols.push(col);
        insertVals.push(payload[key]);
      }
    }

    if (insertCols.length === 0) {
      return res.status(400).json({ message: 'No valid fields found for insertion into businessownerdet' });
    }

    const placeholders = insertCols.map(() => '?').join(', ');

    const sql = `INSERT INTO ${tableName} (${insertCols.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.execute(sql, insertVals);

    res.status(201).json({ boNo: result.insertId, message: 'Business step1 saved successfully' });
  } catch (error) {
    console.error('Error saving business step1 details:', error);
    res.status(500).json({ message: 'Error saving business step1 details', error: error.message });
  }
});

export default router;
