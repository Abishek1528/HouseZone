import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// API endpoint for saving residential step 2 details to existing resownho and bedroom_sizes tables
router.post('/residential/step2', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      roNo,
      facingDirection,
      hallLength,
      hallBreadth,
      noOfBedrooms,
      kitchenLength,
      kitchenBreadth,
      noOfBathrooms,
      bathroom1Type,
      bathroom2Type,
      bathroom3Type,
      bathroom1Access,
      bathroom2Access,
      bathroom3Access,
      floorNo,
      parking2Wheeler,
      parking4Wheeler,
      bedrooms
    } = req.body;

    // Helper functions for safe parsing
    const safeParseFloat = (val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const safeParseInt = (val) => {
      const parsed = parseInt(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Convert floorNo to integer (extract number from string like "Ground" -> 0, "1st" ->1)
    let floorNumber = 0;
    if (floorNo) {
      if (typeof floorNo === 'string') {
        if (floorNo.toLowerCase().includes('ground')) {
          floorNumber = 0;
        } else {
          const match = floorNo.match(/\d+/);
          floorNumber = match ? parseInt(match[0]) : 0;
        }
      } else {
        floorNumber = safeParseInt(floorNo);
      }
    }

    // Use UPDATE then INSERT for resownho to be absolutely sure
    const [existing] = await connection.execute(
      'SELECT roNo FROM resownho WHERE roNo = ?',
      [roNo]
    );

    const parking2WheelerStr = parking2Wheeler === 'Yes' ? 'Yes' : 'No';
    const parking4WheelerStr = parking4Wheeler === 'Yes' ? 'Yes' : 'No';

    if (existing.length > 0) {
      await connection.execute(
        `UPDATE resownho SET
          facing_direction = ?,
          hall_length = ?,
          hall_breadth = ?,
          number_of_bedrooms = ?,
          kitchen_length = ?,
          kitchen_breadth = ?,
          number_of_bathrooms = ?,
          bathroom1_type = ?,
          bathroom2_type = ?,
          bathroom3_type = ?,
          bathroom1_access = ?,
          bathroom2_access = ?,
          bathroom3_access = ?,
          floor_number = ?,
          parking_2wheeler = ?,
          parking_4wheeler = ?
        WHERE roNo = ?`,
        [
          facingDirection || 'North',
          safeParseFloat(hallLength),
          safeParseFloat(hallBreadth),
          safeParseInt(noOfBedrooms),
          safeParseFloat(kitchenLength),
          safeParseFloat(kitchenBreadth),
          safeParseInt(noOfBathrooms),
          bathroom1Type || 'Indian',
          bathroom2Type || null,
          bathroom3Type || null,
          bathroom1Access || null,
          bathroom2Access || null,
          bathroom3Access || null,
          floorNumber,
          parking2WheelerStr,
          parking4WheelerStr,
          roNo
        ]
      );
    } else {
      await connection.execute(
        `INSERT INTO resownho (
          roNo, facing_direction, hall_length, hall_breadth, number_of_bedrooms, 
          kitchen_length, kitchen_breadth, number_of_bathrooms, bathroom1_type, bathroom2_type, bathroom3_type,
          bathroom1_access, bathroom2_access, bathroom3_access, floor_number,
          parking_2wheeler, parking_4wheeler
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          roNo,
          facingDirection || 'North',
          safeParseFloat(hallLength),
          safeParseFloat(hallBreadth),
          safeParseInt(noOfBedrooms),
          safeParseFloat(kitchenLength),
          safeParseFloat(kitchenBreadth),
          safeParseInt(noOfBathrooms),
          bathroom1Type || 'Indian',
          bathroom2Type || null,
          bathroom3Type || null,
          bathroom1Access || null,
          bathroom2Access || null,
          bathroom3Access || null,
          floorNumber,
          parking2WheelerStr,
          parking4WheelerStr
        ]
      );
    }

    // Delete existing bedroom sizes for this roNo to avoid duplicate entries and handle bedroom count changes
    await connection.execute(
      `DELETE FROM bedroom_sizes WHERE roNo = ?`,
      [roNo]
    );

    // Insert bedroom details into existing bedroom_sizes table
    if (bedrooms && Array.isArray(bedrooms) && bedrooms.length > 0) {
      for (let i = 0; i < bedrooms.length; i++) {
        const bedroom = bedrooms[i];
        if (bedroom.length || bedroom.breadth) {
          await connection.execute(
            `INSERT INTO bedroom_sizes (roNo, bedroom_number, length, breadth) VALUES (?, ?, ?, ?)`,
            [
              roNo,
              parseInt(bedroom.number) || (i + 1),
              safeParseFloat(bedroom.length),
              safeParseFloat(bedroom.breadth)
            ]
          );
        }
      }
    }

    await connection.commit();
    
    res.status(201).json({
      message: 'Step 2 saved successfully'
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('CRITICAL: Error saving residential step 2 details:', error);
    res.status(500).json({ 
      message: 'Error saving step 2 details', 
      error: error.message,
      sqlMessage: error.sqlMessage,
      code: error.code
    });
  } finally {
    if (connection) connection.release();
  }
});

export default router;