import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// Save machinery step 1 details into machinery owner details table
router.post('/machinery/step1', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';
    const tableName = 'machinaryowndet';

    const payload = req.body || {};
    console.log('Machinery step1 payload received:', JSON.stringify(payload, null, 2));

    // Fetch columns for the target table
    const [cols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [dbName, tableName]
    );

    const columnNames = cols.map(c => c.COLUMN_NAME.toLowerCase());
    console.log('Available columns in', tableName, columnNames);

    const findCol = (candidates) => {
      for (const cand of candidates) {
        const found = columnNames.find(col => col.includes(cand.toLowerCase()));
        if (found) return found;
      }
      return null;
    };

    const mappings = {
      name: findCol(['name', 'owner', 'mo_name', 'mowner']),
      doorNo: findCol(['door', 'doorno', 'door_no']),
      street: findCol(['street', 'address']),
      pincode: findCol(['pin', 'pincode', 'postal', 'zipcode']),
      area: findCol(['area', 'locality']),
      city: findCol(['city']),
      contactNo: findCol(['phone', 'phno', 'contact', 'ph'])
    };

    console.log('Machinery column mappings:', mappings);

    const insertCols = [];
    const insertVals = [];

    for (const [key, col] of Object.entries(mappings)) {
      if (col && payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
        insertCols.push(col);
        insertVals.push(payload[key]);
        console.log(`Adding field: ${key} -> ${col} = ${payload[key]}`);
      }
    }

    if (insertCols.length === 0) {
      return res.status(400).json({ message: 'No valid fields found for insertion into ' + tableName });
    }

    const placeholders = insertCols.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${insertCols.join(', ')}) VALUES (${placeholders})`;
    console.log('Executing SQL:', sql);
    console.log('With values:', insertVals);
    const [result] = await pool.execute(sql, insertVals);

    res.status(201).json({ moNo: result.insertId, message: 'Machinery step1 saved successfully' });
  } catch (error) {
    console.error('Error saving machinery step1 details:', error);
    res.status(500).json({ 
      message: 'Error saving machinery step1 details', 
      error: error.message 
    });
  }
});

export default router;
