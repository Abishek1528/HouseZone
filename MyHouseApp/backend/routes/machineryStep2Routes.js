import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// Save machinery step 2 details into machinarydet table
router.post('/machinery/step2', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';
    const tableName = 'machinarydet';

    const payload = req.body || {};
    console.log('Machinery step2 payload:', JSON.stringify(payload, null, 2));

    // fetch column names for target table
    const [cols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [dbName, tableName]
    );
    const columnNames = cols.map(c => c.COLUMN_NAME.toLowerCase());
    console.log('machinarydet columns:', columnNames);
    // send columns back for debugging if needed
    res.setHeader('X-Machinery-Columns', columnNames.join(','));

    const insertCols = [];
    const insertVals = [];

    // helper to convert camelCase to snake_case
    const normalize = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();

    Object.entries(payload).forEach(([key, value]) => {
      let columnKey = normalize(key);

      // special handling for owner id
      if (key === 'moNo') {
        if (columnNames.includes('machinaryowndet_id')) columnKey = 'machinaryowndet_id';
        else if (columnNames.includes('mo_no')) columnKey = 'mo_no';
      }

      // fallback: if normalized key not found but original exists
      if (!columnNames.includes(columnKey) && columnNames.includes(key.toLowerCase())) {
        columnKey = key.toLowerCase();
      }

      if (columnNames.includes(columnKey)) {
        insertCols.push(columnKey);
        if (typeof value === 'object' && value !== null) {
          insertVals.push(JSON.stringify(value));
        } else {
          insertVals.push(value);
        }
        console.log('matched payload', key, '->', columnKey);
      }
    });

    if (insertCols.length === 0) {
      // try fallback to a generic JSON column if present
      const fallbackCol = columnNames.find(c => ['data','payload','info','details','json'].includes(c));
      if (fallbackCol) {
        console.log('No direct matches; inserting entire payload into', fallbackCol);
        await pool.execute(`INSERT INTO ${tableName} (${fallbackCol}) VALUES (?)`, [JSON.stringify(payload)]);
        return res.status(201).json({ message: 'Machinery step2 saved successfully (fallback)' });
      }
      return res.status(400).json({ message: 'No matching columns found in ' + tableName, columns: columnNames });
    }

    const placeholders = insertCols.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${insertCols.join(', ')}) VALUES (${placeholders})`;
    console.log('Executing SQL:', sql);
    console.log('Values:', insertVals);

    await pool.execute(sql, insertVals);
    res.status(201).json({ message: 'Machinery step2 saved successfully' });
  } catch (error) {
    console.error('Error saving machinery step2 details:', error);
    res.status(500).json({ message: 'Error saving machinery step2 details', error: error.message });
  }
});

export default router;
