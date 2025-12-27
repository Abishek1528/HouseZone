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
        rh.floor_number as floorNumber,
        rh.parking_2wheeler as parking2Wheeler,
        rh.parking_4wheeler as parking4Wheeler,
        rp.advance_amount as advanceAmount,
        rp.monthly_rent as monthlyRent,
        rp.lease_amount as leaseAmount
      FROM resowndet rd
      LEFT JOIN resownho rh ON rd.roNo = rh.roNo
      LEFT JOIN resownpay rp ON rd.roNo = rp.roNo
      ORDER BY rd.roNo DESC
    `;
    
    const [rows] = await pool.execute(query);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching residential owners:', error);
    res.status(500).json({ message: 'Error fetching owners', error: error.message });
  }
});

export default router;