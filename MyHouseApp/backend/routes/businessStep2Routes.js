import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// Save business step 2 details into existing businessownerpro table
router.post('/business/step2', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const dbName = process.env.DB_NAME || 'cdmrental';
    const tableName = 'businessownerpro';

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
      boNo: findCol(['bo', 'bono', 'bono', 'owner_id', 'ownerno', 'roNo', 'rono', 'id']),
      doorFacing: findCol(['facing', 'door_facing', 'doorfacing']),
      propertyType: findCol(['property', 'property_type', 'ptype']),
      areaLength: findCol(['length', 'area_length', 'arealength']),
      areaBreadth: findCol(['breadth', 'area_breadth', 'areabreadth']),
      restroomAvailable: findCol(['restroom', 'toilet', 'washroom']),
      floorNumber: findCol(['floor', 'floor_number', 'fno'])
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
      return res.status(400).json({ message: 'No valid fields found for insertion into businessownerpro' });
    }

    const placeholders = insertCols.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${insertCols.join(', ')}) VALUES (${placeholders})`;

    await connection.execute(sql, insertVals);
    await connection.commit();

    res.status(201).json({ message: 'Business step2 saved successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error saving business step2 details:', error);
    res.status(500).json({ message: 'Error saving business step2 details', error: error.message });
  } finally {
    connection.release();
  }
});

export default router;
