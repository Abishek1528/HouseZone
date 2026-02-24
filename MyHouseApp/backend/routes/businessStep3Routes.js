import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// Save business step 3 details into existing businessownerrent table
router.post('/business/step3', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';
    const tableName = 'businessownerrent';

    const payload = req.body || {};

    // Fetch columns for the target table
    const [cols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [dbName, tableName]
    );

    const columnNames = cols.map(c => c.COLUMN_NAME.toLowerCase());

    const findCol = (candidates) => {
      for (const cand of candidates) {
        const found = columnNames.find(col => col.includes(cand.toLowerCase()));
        if (found) return found;
      }
      return null;
    };

    const mappings = {
      boNo: findCol(['bo', 'bono', 'owner_id', 'ownerno', 'id']),
      advanceAmount: findCol(['advance', 'advance_amount', 'adv_amount']),
      monthlyRent: findCol(['rent', 'monthly_rent', 'rent_amount']),
      leaseAmount: findCol(['lease', 'lease_amount'])
    };

    const insertCols = [];
    const insertVals = [];

    for (const [key, col] of Object.entries(mappings)) {
      if (col && payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
        insertCols.push(col);
        insertVals.push(payload[key]);
      }
    }

    if (insertCols.length === 0) {
      return res.status(400).json({ message: 'No valid fields found for insertion into businessownerrent' });
    }

    const placeholders = insertCols.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${insertCols.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.execute(sql, insertVals);

    res.status(201).json({ message: 'Business step3 saved successfully' });
  } catch (error) {
    console.error('Error saving business step3 details:', error);
    res.status(500).json({ message: 'Error saving business step3 details', error: error.message });
  }
});

export default router;
