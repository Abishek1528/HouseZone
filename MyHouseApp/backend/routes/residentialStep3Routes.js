import { Router } from 'express';
import { pool } from '../config/database.js';
import upload from '../middleware/upload.js';

const router = Router();

// API endpoint for saving residential step 3 details to existing resownpay table
router.post('/residential/step3', async (req, res) => {
  try {
    const {
      roNo,
      advanceAmount,
      monthlyRent
    } = req.body;

    // Insert residential step 3 details into existing resownpay table
    const [result] = await pool.execute(
      `INSERT INTO resownpay (
        roNo, advance_amount, monthly_rent
      ) VALUES (?, ?, ?)`,
      [
        roNo,
        parseFloat(advanceAmount),
        parseFloat(monthlyRent)
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

export default router;