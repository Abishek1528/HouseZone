import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// API endpoint for getting all residential owners for admin view
router.get('/residential/owners', async (req, res) => {
  try {
    // Join all relevant tables to get owner details
    const query = `
      SELECT 
        rd.roNo as id,
        rd.roName as ownerName,
        rd.roDoor as doorNo,
        rd.roStreet as street,
        rd.roArea as area,
        rd.roPin as pincode,
        rd.roCity as city,
        rd.roPhNo as contactNo,
        rh.facing_direction as facingDirection,
        rh.hall_length as hallLength,
        rh.hall_breadth as hallBreadth,
        rh.number_of_bedrooms as numberOfBedrooms,
        rh.kitchen_length as kitchenLength,
        rh.kitchen_breadth as kitchenBreadth,
        rh.number_of_bathrooms as numberOfBathrooms,
        rh.bathroom1_type as bathroom1Type,
        rh.bathroom2_type as bathroom2Type,
        rh.bathroom3_type as bathroom3Type,
        rh.bathroom1_access as bathroom1Access,
        rh.bathroom2_access as bathroom2Access,
        rh.bathroom3_access as bathroom3Access,
        rh.floor_number as floorNumber,
        rh.parking_2wheeler as parking2Wheeler,
        rh.parking_4Wheeler as parking4Wheeler,
        rp.advance_amount as advanceAmount,
        rp.monthly_rent as monthlyRent,
        rp.lease_amount as leaseAmount,
        l.street_breadth as streetSize,
        l.bus_stop as nearbyBusStop,
        l.bus_stop_distance as nearbyBusStopDistance,
        l.school as nearbySchool,
        l.school_distance as nearbySchoolDistance,
        l.shopping_mall as nearbyShoppingMall,
        l.shopping_mall_distance as nearbyShoppingMallDistance,
        l.bank as nearbyBank,
        l.bank_distance as nearbyBankDistance,
        c.condition_numbers as conditionNumbers
      FROM resowndet rd
      LEFT JOIN resownho rh ON rd.roNo = rh.roNo
      LEFT JOIN resownpay rp ON rd.roNo = rp.roNo
      LEFT JOIN location l ON rd.roNo = l.roNo
      LEFT JOIN conditions c ON rd.roNo = c.roNo
      ORDER BY rd.roNo DESC
    `;
    
    const [rows] = await pool.execute(query);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching residential owners:', error);
    res.status(500).json({ message: 'Error fetching owners', error: error.message });
  }
});

// API endpoint for updating location & amenities details
router.post('/residential/location-amenities', async (req, res) => {
  try {
    const {
      roNo,
      streetSizeBreadth,
      nearbyBusStop,
      busStopDistance,
      nearbySchool,
      schoolDistance,
      nearbyShoppingMall,
      shoppingMallDistance,
      nearbyBank,
      bankDistance
    } = req.body;
    
    console.log('Received location data:', { roNo, streetSizeBreadth, nearbyBusStop, busStopDistance, nearbySchool, schoolDistance, nearbyShoppingMall, shoppingMallDistance, nearbyBank, bankDistance });
    
    // Convert distance values to numbers if they exist, otherwise set to null
    const busStopDistanceNum = busStopDistance ? parseFloat(busStopDistance) : null;
    const schoolDistanceNum = schoolDistance ? parseFloat(schoolDistance) : null;
    const shoppingMallDistanceNum = shoppingMallDistance ? parseFloat(shoppingMallDistance) : null;
    const bankDistanceNum = bankDistance ? parseFloat(bankDistance) : null;
    
    // Check if location record already exists for this roNo
    let existingRows = [];
    try {
      [existingRows] = await pool.execute(
        'SELECT roNo FROM location WHERE roNo = ?',
        [roNo]
      );
      console.log('Found existing records:', existingRows.length);
    } catch (queryError) {
      console.error('Error checking existing records:', queryError);
      throw queryError;
    }
    
    if (existingRows.length > 0) {
      // Update existing record
      try {
        await pool.execute(
          `UPDATE location SET
            street_breadth = ?,
            bus_stop = ?,
            bus_stop_distance = ?,
            school = ?,
            school_distance = ?,
            shopping_mall = ?,
            shopping_mall_distance = ?,
            bank = ?,
            bank_distance = ?
          WHERE roNo = ?`,
          [
            streetSizeBreadth || null,
            nearbyBusStop || null,
            busStopDistanceNum,
            nearbySchool || null,
            schoolDistanceNum,
            nearbyShoppingMall || null,
            shoppingMallDistanceNum,
            nearbyBank || null,
            bankDistanceNum,
            roNo
          ]
        );
        console.log('Updated existing location record');
      } catch (updateError) {
        console.error('Error updating location record:', updateError);
        throw updateError;
      }
    } else {
      // Insert new record
      try {
        await pool.execute(
          `INSERT INTO location (
            roNo, street_breadth, bus_stop, bus_stop_distance, school, school_distance,
            shopping_mall, shopping_mall_distance, bank, bank_distance
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            roNo,
            streetSizeBreadth || null,
            nearbyBusStop || null,
            busStopDistanceNum,
            nearbySchool || null,
            schoolDistanceNum,
            nearbyShoppingMall || null,
            shoppingMallDistanceNum,
            nearbyBank || null,
            bankDistanceNum
          ]
        );
        console.log('Inserted new location record');
      } catch (insertError) {
        console.error('Error inserting location record:', insertError);
        throw insertError;
      }
    }
    
    res.status(201).json({
      message: 'Location & amenities details updated successfully'
    });
  } catch (error) {
    console.error('Error updating location & amenities details:', error);
    res.status(500).json({ message: 'Error updating location & amenities details', error: error.message });
  }
});

// API endpoint for saving conditions
router.post('/residential/conditions', async (req, res) => {
  try {
    const { roNo, conditionNumbers } = req.body;
    
    console.log('Received conditions data:', { roNo, conditionNumbers });
    
    // Convert conditionNumbers to JSON string if it's an array
    const conditionNumbersJson = Array.isArray(conditionNumbers) ? JSON.stringify(conditionNumbers) : conditionNumbers;
    
    // Check if conditions record already exists for this roNo
    let existingRows = [];
    try {
      [existingRows] = await pool.execute(
        'SELECT roNo FROM conditions WHERE roNo = ?',
        [roNo]
      );
      console.log('Found existing conditions records:', existingRows.length);
    } catch (queryError) {
      console.error('Error checking existing conditions records:', queryError);
      throw queryError;
    }
    
    if (existingRows.length > 0) {
      // Update existing record
      try {
        await pool.execute(
          `UPDATE conditions SET
            condition_numbers = ?
          WHERE roNo = ?`,
          [conditionNumbersJson, roNo]
        );
        console.log('Updated existing conditions record');
      } catch (updateError) {
        console.error('Error updating conditions record:', updateError);
        throw updateError;
      }
    } else {
      // Insert new record
      try {
        await pool.execute(
          `INSERT INTO conditions (roNo, condition_numbers) VALUES (?, ?)`,
          [roNo, conditionNumbersJson]
        );
        console.log('Inserted new conditions record');
      } catch (insertError) {
        console.error('Error inserting conditions record:', insertError);
        throw insertError;
      }
    }
    
    res.status(201).json({
      message: 'Conditions updated successfully'
    });
  } catch (error) {
    console.error('Error updating conditions:', error);
    res.status(500).json({ message: 'Error updating conditions', error: error.message });
  }
});

export default router;