import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// Debug route: return detected columns for business tables
router.get('/business/debug/columns', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';
    const tables = [
      'businessownerdet',
      'businessownerpro',
      'businessownerrent'
    ];

    // If query param 'table' provided, restrict to that
    const { table } = req.query;
    const targetTables = table ? tables.filter(t => t.toLowerCase() === table.toLowerCase()) : tables;

    const result = {};

    for (const tbl of targetTables) {
      const [cols] = await pool.execute(
        `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION`,
        [dbName, tbl]
      );

      result[tbl] = cols.map(c => ({ column: c.COLUMN_NAME, type: c.DATA_TYPE }));
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching debug columns:', error);
    res.status(500).json({ message: 'Error fetching columns', error: error.message });
  }
});

export default router;
