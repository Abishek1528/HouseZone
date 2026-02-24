import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET all business properties for tenant view
router.get('/business/properties', async (req, res) => {
  try {
    const { rent, area, propertyType } = req.query;

    let query = `
      SELECT
        bd.id as id,
        bd.area as area,
        bp.property_type as propertyType,
        br.monthly_rent as monthlyRent,
        br.lease_amount as leaseAmount
      FROM businessownerdet bd
      LEFT JOIN businessownerpro bp ON bd.id = bp.businessownerdet_id
      LEFT JOIN businessownerrent br ON bd.id = br.businessownerdet_id
    `;

    const conditions = [];
    const params = [];

    if (rent) {
      if (rent.includes('-')) {
        const [minRent, maxRent] = rent.split('-').map(Number);
        conditions.push('(br.monthly_rent BETWEEN ? AND ? OR br.lease_amount BETWEEN ? AND ?)');
        params.push(minRent, maxRent, minRent, maxRent);
      } else {
        conditions.push('(br.monthly_rent = ? OR br.lease_amount = ?)');
        params.push(Number(rent), Number(rent));
      }
    }

    if (area && area !== '') {
      conditions.push('bd.area LIKE ?');
      params.push(`%${area}%`);
    }

    if (propertyType && propertyType !== '') {
      conditions.push('bp.property_type = ?');
      params.push(propertyType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY bd.id DESC';

    const [rows] = await pool.execute(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching business properties:', error);
    res.status(500).json({ message: 'Error fetching business properties', error: error.message });
  }
});

// GET detailed business property information
router.get('/business/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT
        bd.id as id,
        bd.name_of_person as ownerName,
        bd.door_no as doorNo,
        bd.street as street,
        bd.area as area,
        bd.pincode as pincode,
        bd.city as city,
        bd.contact_no as contactNo,
        bp.door_facing as doorFacing,
        bp.property_type as propertyType,
        bp.length_feet as lengthFeet,
        bp.breadth_feet as breadthFeet,
        bp.restroom_available as restroomAvailable,
        bp.floor_number as floorNumber,
        br.advance_amount as advanceAmount,
        br.monthly_rent as monthlyRent,
        br.lease_amount as leaseAmount
      FROM businessownerdet bd
      LEFT JOIN businessownerpro bp ON bd.id = bp.businessownerdet_id
      LEFT JOIN businessownerrent br ON bd.id = br.businessownerdet_id
      WHERE bd.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Property not found' });

    const detail = rows[0];
    // Calculate total area if available
    if (detail.lengthFeet && detail.breadthFeet) {
      detail.totalArea = (parseFloat(detail.lengthFeet) * parseFloat(detail.breadthFeet)).toFixed(2);
    }

    res.status(200).json(detail);
  } catch (error) {
    console.error('Error fetching business property details:', error);
    res.status(500).json({ message: 'Error fetching business property details', error: error.message });
  }
});

export default router;
