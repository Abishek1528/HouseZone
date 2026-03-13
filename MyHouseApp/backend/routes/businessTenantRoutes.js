import { Router } from 'express';
import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const businessUploadsDir = path.join(__dirname, '../uploads', 'business');

// GET all business properties for tenant view
router.get('/business/properties', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';
    const { rent, area, propertyType } = req.query;

    let query = `SELECT
      bd.id,
      bd.area,
      bp.property_type,
      br.monthly_rent,
      br.lease_amount
    FROM businessownerdet bd
    LEFT JOIN businessownerpro bp ON bd.id = bp.businessownerdet_id
    LEFT JOIN businessownerrent br ON bd.id = br.businessownerdet_id`;

    const conditions = [];
    const params = [];

    if (rent) {
      if (rent.includes('-')) {
        const [minRent, maxRent] = rent.split('-').map(Number);
        conditions.push(`(br.monthly_rent BETWEEN ? AND ? OR br.lease_amount BETWEEN ? AND ?)`);
        params.push(minRent, maxRent, minRent, maxRent);
      } else {
        conditions.push(`(br.monthly_rent = ? OR br.lease_amount = ?)`);
        params.push(Number(rent), Number(rent));
      }
    }

    if (area && area !== '') {
      conditions.push(`bd.area LIKE ?`);
      params.push(`%${area}%`);
    }

    if (propertyType && propertyType !== '') {
      conditions.push(`bp.property_type = ?`);
      params.push(propertyType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY bd.id DESC`;

    const [rows] = await pool.execute(query, params);

    let filenames = [];
    try {
      filenames = fs.readdirSync(businessUploadsDir);
    } catch (_) {
      filenames = [];
    }
    const origin = `${req.protocol}://${req.get('host')}`;
    const withImages = rows.map(row => {
      const id = row.id;
      const prefix = `business-${id}-`;
      const urls = filenames
        .filter(fn => fn.startsWith(prefix))
        .map(fn => `${origin}/uploads/business/${fn}`);
      return { ...row, images: urls };
    });
    res.status(200).json(withImages);
  } catch (error) {
    console.error('Error fetching business properties:', error);
    res.status(500).json({ message: 'Error fetching business properties', error: error.message });
  }
});

// GET detailed business property information
router.get('/business/properties/:id', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT
        bd.id,
        bd.name_of_person,
        bd.door_no,
        bd.street,
        bd.area,
        bd.pincode,
        bd.city,
        bd.contact_no,
        bp.door_facing,
        bp.property_type,
        bp.length_feet,
        bp.breadth_feet,
        bp.restroom_available,
        bp.floor_number,
        br.advance_amount,
        br.monthly_rent,
        br.lease_amount
      FROM businessownerdet bd
      LEFT JOIN businessownerpro bp ON bd.id = bp.businessownerdet_id
      LEFT JOIN businessownerrent br ON bd.id = br.businessownerdet_id
      WHERE bd.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Property not found' });

    const property = rows[0];

    // Restructure the data to match the residential format
    const structuredData = {
      id: property.id,
      images: [], // This will be populated next
      addressDetails: {
        name_of_person: property.name_of_person,
        door_no: property.door_no,
        street: property.street,
        area: property.area,
        pincode: property.pincode,
        city: property.city,
        contact_no: property.contact_no,
      },
      propertySpecs: {
        door_facing: property.door_facing,
        property_type: property.property_type,
        totalArea: (parseFloat(property.length_feet) * parseFloat(property.breadth_feet)).toFixed(0),
        length_feet: property.length_feet,
        breadth_feet: property.breadth_feet,
        restroom_available: property.restroom_available,
        floor_number: property.floor_number,
      },
      paymentInfo: {
        advance_amount: property.advance_amount,
        monthly_rent: property.monthly_rent,
        lease_amount: property.lease_amount,
      },
    };

    let filenames = [];
    try {
      filenames = fs.readdirSync(businessUploadsDir);
    } catch (_) {
      filenames = [];
    }
    const origin = `${req.protocol}://${req.get('host')}`;
    const prefix = `business-${id}-`;
    structuredData.images = filenames
      .filter(fn => fn.startsWith(prefix))
      .map(fn => `${origin}/uploads/business/${fn}`);

    res.status(200).json(structuredData);
  } catch (error) {
    console.error('Error fetching business property details:', error);
    res.status(500).json({ message: 'Error fetching business property details', error: error.message });
  }
});

export default router;
