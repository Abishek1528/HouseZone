import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// API endpoint for saving residential step 1 details to existing resowndet table
router.post('/residential/save-step1', async (req, res) => {
  try {
    const {
      name,
      doorNo,
      street,
      pincode,
      area,
      city,
      contactNo
    } = req.body;

    // Insert residential step 1 details into existing resowndet table
    const [result] = await pool.execute(
      `INSERT INTO resowndet (
        roName, roDoor, roStreet, roArea, roPin, roCity, roPhNo
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        parseInt(doorNo), 
        street, 
        area, 
        parseInt(pincode), 
        city, 
        parseInt(contactNo)
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Residential step 1 details saved successfully'
    });
  } catch (error) {
    console.error('Error saving residential step 1 details:', error);
    res.status(500).json({ message: 'Error saving residential step 1 details', error: error.message });
  }
});

// API endpoint for getting residential step 1 details from existing resowndet table
router.get('/residential/step1/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT 
        roNo as id, roName as name, roDoor as doorNo, roStreet as street, 
        roArea as area, roPin as pincode, roCity as city, roPhNo as contactNo
      FROM resowndet 
      WHERE roNo = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No residential details found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching residential step 1 details:', error);
    res.status(500).json({ message: 'Error fetching residential step 1 details', error: error.message });
  }
});

export default router;