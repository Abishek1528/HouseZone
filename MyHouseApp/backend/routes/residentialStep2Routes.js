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

    // Insert residential step 2 details into existing resownho table
    const safeParseFloat = (val) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const safeParseInt = (val) => {
      const parsed = parseInt(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    console.log('Inserting into resownho with values:', {
      roNo, facingDirection, hallLength, hallBreadth, noOfBedrooms, kitchenLength, kitchenBreadth, 
      noOfBathrooms, bathroom1Type, bathroom2Type, bathroom3Type, bathroom1Access, 
      bathroom2Access, bathroom3Access, floorNo, parking2Wheeler, parking4Wheeler
    });

    // Use INSERT ... ON DUPLICATE KEY UPDATE for resownho
    await connection.execute(
      `INSERT INTO resownho (
        roNo, facing_direction, hall_length, hall_breadth, number_of_bedrooms, 
        kitchen_length, kitchen_breadth, number_of_bathrooms, bathroom1_type, bathroom2_type, bathroom3_type,
        bathroom1_access, bathroom2_access, bathroom3_access, floor_number,
        parking_2wheeler, parking_4wheeler
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        facing_direction = VALUES(facing_direction),
        hall_length = VALUES(hall_length),
        hall_breadth = VALUES(hall_breadth),
        number_of_bedrooms = VALUES(number_of_bedrooms),
        kitchen_length = VALUES(kitchen_length),
        kitchen_breadth = VALUES(kitchen_breadth),
        number_of_bathrooms = VALUES(number_of_bathrooms),
        bathroom1_type = VALUES(bathroom1_type),
        bathroom2_type = VALUES(bathroom2_type),
        bathroom3_type = VALUES(bathroom3_type),
        bathroom1_access = VALUES(bathroom1_access),
        bathroom2_access = VALUES(bathroom2_access),
        bathroom3_access = VALUES(bathroom3_access),
        floor_number = VALUES(floor_number),
        parking_2wheeler = VALUES(parking_2wheeler),
        parking_4wheeler = VALUES(parking_4wheeler)`,
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
        floorNo || 'Ground',
        parking2Wheeler || 'No',
        parking4Wheeler || 'No'
      ]
    );

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