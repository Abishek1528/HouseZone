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
      floorNo,
      parking2Wheeler,
      parking4Wheeler,
      bedrooms
    } = req.body;

    // Insert residential step 2 details into existing resownho table
    await connection.execute(
      `INSERT INTO resownho (
        roNo, facing_direction, hall_length, hall_breadth, number_of_bedrooms, 
        kitchen_length, kitchen_breadth, number_of_bathrooms, bathroom1_type, bathroom2_type, bathroom3_type, floor_number,
        parking_2wheeler, parking_4wheeler
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        roNo,
        facingDirection,
        parseFloat(hallLength),
        parseFloat(hallBreadth),
        parseInt(noOfBedrooms),
        parseFloat(kitchenLength),
        parseFloat(kitchenBreadth),
        parseInt(noOfBathrooms),
        bathroom1Type,
        bathroom2Type || null,
        bathroom3Type || null,
        floorNo,
        parking2Wheeler || null,
        parking4Wheeler || 'No'
      ]
    );

    // Insert bedroom details into existing bedroom_sizes table
    if (bedrooms && bedrooms.length > 0) {
      for (let i = 0; i < bedrooms.length; i++) {
        const bedroom = bedrooms[i];
        await connection.execute(
          `INSERT INTO bedroom_sizes (roNo, bedroom_number, length, breadth) VALUES (?, ?, ?, ?)`,
          [
            roNo,
            parseInt(bedroom.number),
            parseFloat(bedroom.length),
            parseFloat(bedroom.breadth)
          ]
        );
      }
    }

    await connection.commit();
    
    res.status(201).json({
      message: 'Step 2 saved successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error saving residential step 2 details:', error);
    res.status(500).json({ message: 'Error saving step 2 details', error: error.message });
  } finally {
    connection.release();
  }
});

export default router;