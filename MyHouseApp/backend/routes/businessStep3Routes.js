import { Router } from 'express';
import { pool } from '../config/database.js';
import upload from '../middleware/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    console.log('Inserting into businessownerrent:', {
      sql: `INSERT INTO ${tableName} (${insertCols.join(', ')}) VALUES (${insertCols.map(() => '?').join(', ')})`,
      values: insertVals
    });

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

// Upload business property images
router.post('/business/images', upload.array('images', 7), async (req, res) => {
  try {
    const boNo = req.body?.boNo;
    if (!boNo) {
      return res.status(400).json({ message: 'boNo is required to associate images' });
    }
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }
    const baseDir = path.join(__dirname, '../uploads', 'business');
    try { fs.mkdirSync(baseDir, { recursive: true }); } catch (_) {}
    const origin = `${req.protocol}://${req.get('host')}`;
    const urls = files.map(f => `${origin}/uploads/business/${path.basename(f.filename || f.originalname)}`);
    res.status(201).json({ message: 'Images uploaded successfully', boNo, images: urls });
  } catch (error) {
    console.error('Error uploading business images:', error);
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
});

export default router;
