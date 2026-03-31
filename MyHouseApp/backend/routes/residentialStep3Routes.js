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

// API endpoint for saving residential step 3 details to existing resownpay table
router.post('/residential/step3', async (req, res) => {
  try {
    const {
      roNo,
      advanceAmount,
      monthlyRent,
      leaseAmount
    } = req.body;

    // Use INSERT ... ON DUPLICATE KEY UPDATE for resownpay
    await pool.execute(
      `INSERT INTO resownpay (
        roNo, advance_amount, monthly_rent, lease_amount
      ) VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        advance_amount = VALUES(advance_amount),
        monthly_rent = VALUES(monthly_rent),
        lease_amount = VALUES(lease_amount)`,
      [
        roNo,
        advanceAmount ? parseFloat(advanceAmount) || 0 : null,
        monthlyRent ? parseFloat(monthlyRent) || 0 : null,
        leaseAmount ? parseFloat(leaseAmount) || null : null
      ]
    );

    res.status(201).json({
      message: 'Step 3 saved successfully'
    });
  } catch (error) {
    console.error('Error saving residential step 3 details:', error);
    res.status(500).json({ message: 'Error saving step 3 details', error: error.message });
  }
});

// Upload residential images (expects multipart/form-data with field 'images')
router.post('/residential/images', upload.array('images', 7), async (req, res) => {
  try {
    const roNo = req.body?.roNo;
    if (!roNo) {
      return res.status(400).json({ message: 'roNo is required to associate images' });
    }

    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const baseUploads = path.join(__dirname, '../uploads', 'residential');
    try {
      fs.mkdirSync(baseUploads, { recursive: true });
    } catch (_) {}

    const origin = `${req.protocol}://${req.get('host')}`;
    const urls = files.map(f => {
      const filename = path.basename(f.filename || f.originalname);
      return `${origin}/uploads/residential/${filename}`;
    });

    res.status(201).json({
      message: 'Images uploaded successfully',
      roNo,
      images: urls
    });
  } catch (error) {
    console.error('Error uploading residential images:', error);
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
});

export default router;
