import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// API endpoint for getting all residential properties for tenant view
router.get('/residential/properties', async (req, res) => {
  try {
    // Join all relevant tables to get property details
    const query = `
      SELECT 
        rd.roNo as id,
        rd.roArea as area,
        rh.number_of_bedrooms as bedrooms,
        rp.monthly_rent as rent,
        rp.lease_amount as leaseAmount
      FROM resowndet rd
      INNER JOIN resownho rh ON rd.roNo = rh.roNo
      INNER JOIN resownpay rp ON rd.roNo = rp.roNo
      ORDER BY rd.roNo DESC
    `;
    
    const [rows] = await pool.execute(query);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching residential properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
});

// API endpoint for saving tenant details
router.post('/residential/tenant-details', async (req, res) => {
  try {
    const {
      tenant_name,
      job,
      salary,
      native_place,
      current_address,
      mobile_number,
      alternate_number
    } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO tenant_details (
        tenant_name, job, salary, native_place, current_address, mobile_number, alternate_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        tenant_name,
        job,
        parseFloat(salary),
        native_place,
        current_address,
        mobile_number,
        alternate_number
      ]
    );
    
    res.status(201).json({
      message: 'Tenant details saved successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error saving tenant details:', error);
    res.status(500).json({ message: 'Error saving tenant details', error: error.message });
  }
});


router.get('/residential/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get step 1 details (address information)
    const [step1Rows] = await pool.execute(
      `SELECT 
        roNo as id,
        roName as ownerName,
        roDoor as doorNo,
        roStreet as street,
        roArea as area,
        roPin as pincode,
        roCity as city,
        roPhNo as contactNo
      FROM resowndet 
      WHERE roNo = ?`,
      [id]
    );
    
    if (step1Rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const propertyDetails = step1Rows[0];
    
    // Get step 2 details (house details)
    let step2Rows = [];
    try {
      [step2Rows] = await pool.execute(
        `SELECT 
          roNo,
          facing_direction as facingDirection,
          hall_length as hallLength,
          hall_breadth as hallBreadth,
          number_of_bedrooms as numberOfBedrooms,
          kitchen_length as kitchenLength,
          kitchen_breadth as kitchenBreadth,
          number_of_bathrooms as numberOfBathrooms,
          bathroom1_type as bathroom1Type,
          bathroom2_type as bathroom2Type,
          bathroom3_type as bathroom3Type,
          floor_number as floorNumber,
          parking_2wheeler as parking2Wheeler,
          parking_4wheeler as parking4Wheeler
        FROM resownho 
        WHERE roNo = ?`,
        [id]
      );
    } catch (queryError) {
      console.error('Error executing step 2 query:', queryError);
      step2Rows = [];
    }
    
    if (step2Rows.length > 0) {
      // Calculate total square feet for hall, kitchen, and bedrooms
      const step2Data = step2Rows[0];
      
      // Hall total area
      if (step2Data.hallLength && step2Data.hallBreadth) {
        step2Data.hallTotalArea = (step2Data.hallLength * step2Data.hallBreadth).toFixed(2);
      }
      
      // Kitchen total area
      if (step2Data.kitchenLength && step2Data.kitchenBreadth) {
        step2Data.kitchenTotalArea = (step2Data.kitchenLength * step2Data.kitchenBreadth).toFixed(2);
      }
      
      // Get bedroom sizes
      const [bedroomRows] = await pool.execute(
        `SELECT 
          bedroom_number as bedroomNumber,
          length,
          breadth
        FROM bedroom_sizes 
        WHERE roNo = ?
        ORDER BY bedroom_number`,
        [id]
      );
      
      // Calculate bedroom total areas
      step2Data.bedrooms = bedroomRows.map(bedroom => ({
        ...bedroom,
        totalArea: (bedroom.length * bedroom.breadth).toFixed(2)
      }));
      
      propertyDetails.houseDetails = step2Data;
    }
    
  // Get step 3 details (payment information)
    const [step3Rows] = await pool.execute(
      `SELECT 
        roNo,
        advance_amount as advanceAmount,
        monthly_rent as monthlyRent,
        lease_amount as leaseAmount
      FROM resownpay 
      WHERE roNo = ?`,
    
      [id]
    );
    
    if (step3Rows.length > 0) {
      propertyDetails.paymentDetails = step3Rows[0];
    }
    
    res.status(200).json(propertyDetails);
  } catch (error) {
    console.error('Error fetching residential property details:', error);
    res.status(500).json({ message: 'Error fetching property details', error: error.message });
  }
});

export default router;