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

const normalizeImageUrl = (url, req) => {
  if (!url) return null;
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http')) return trimmed;
  const host = req.get('host');
  const protocol = req.protocol;
  const basename = path.basename(trimmed);
  if (!basename) return null;
  return `${protocol}://${host}/uploads/business/${basename}`;
};

const loadImageColumns = async (tableName) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';
    const [cols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [dbName, tableName]
    );
    const names = cols.map(c => c.COLUMN_NAME.toLowerCase());
    const found = [];
    const imagesCol = names.find(n => n === 'images' || n.includes('images') || n.includes('photos'));
    if (imagesCol) found.push({ col: imagesCol, type: 'json' });
    for (let i = 1; i <= 7; i++) {
      const c = names.find(n => n === `image${i}` || n === `shop_photo${i}` || n === `photo${i}`);
      if (c) found.push({ col: c, type: 'single', idx: i });
    }
    return found;
  } catch (_) {
    return [];
  }
};

// GET all business properties for tenant view
router.get('/business/properties', async (req, res) => {
  try {
    const { rent, area, propertyType } = req.query;
    console.log('Fetching business properties with filters:', { rent, area, propertyType });

    const rentImgCols = await loadImageColumns('businessownerrent');

    const imageSelectParts = rentImgCols.map(c => `br.\`${c.col}\` as br_${c.col}`);
    const imageSelectSql = imageSelectParts.length > 0 ? ', ' + imageSelectParts.join(', ') : '';

    let query = `SELECT 
      bd.id,
      bd.area,
      bp.property_type as propertyType,
      bp.property_type,
      br.monthly_rent as monthlyRent,
      br.monthly_rent,
      br.lease_amount as leaseAmount,
      br.lease_amount
      ${imageSelectSql}
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
      conditions.push(`bd.area = ?`);
      params.push(area);
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
      filenames = fs.existsSync(businessUploadsDir) ? fs.readdirSync(businessUploadsDir) : [];
    } catch (_) {
      filenames = [];
    }
    const origin = `${req.protocol}://${req.get('host')}`;
    const withImages = rows.map(row => {
      const id = row.id;
      const images = [];

      for (const imgCol of rentImgCols) {
        const raw = row[`br_${imgCol.col}`];
        if (imgCol.type === 'json' && raw) {
          try {
            const arr = typeof raw === 'string' ? JSON.parse(raw) : (Array.isArray(raw) ? raw : []);
            for (const item of arr) {
              const n = normalizeImageUrl(item, req);
              if (n) images.push(n);
            }
          } catch (_) {}
        } else if (imgCol.type === 'single' && raw) {
          const n = normalizeImageUrl(raw, req);
          if (n) images.push(n);
        }
        delete row[`br_${imgCol.col}`];
      }

      if (images.length === 0 && filenames.length > 0) {
        const prefix = `business-${id}-`;
        const urls = filenames
          .filter(fn => fn.startsWith(prefix))
          .map(fn => `${origin}/uploads/business/${fn}`);
        images.push(...urls);
      }

      return { ...row, images };
    });
    res.status(200).json(withImages);
  } catch (error) {
    console.error('Error fetching business properties:', error);
    res.status(500).json({ message: 'Error fetching business properties', error: error.message });
  }
});

// GET distinct areas from business owner listings (for tenant filter)
router.get('/business/properties/areas', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT DISTINCT bd.area
       FROM businessownerdet bd
       WHERE bd.area IS NOT NULL AND TRIM(bd.area) != ''
       ORDER BY bd.area ASC`
    );
    const areas = rows
      .map((row) => (row.area != null ? String(row.area).trim() : ''))
      .filter(Boolean);
    res.status(200).json(areas);
  } catch (error) {
    console.error('Error fetching business property areas:', error);
    res.status(500).json({ message: 'Error fetching business property areas', error: error.message });
  }
});

// GET detailed business property information
router.get('/business/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching business property details for id:', id);

    const rentImgCols = await loadImageColumns('businessownerrent');
    const imageSelectParts = rentImgCols.map(c => `br.\`${c.col}\` as br_${c.col}`);
    const imageSelectSql = imageSelectParts.length > 0 ? ', ' + imageSelectParts.join(', ') : '';

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
        bp.hall_length AS length_feet,
        bp.hall_breadth AS breadth_feet,
        bp.washroom_available AS restroom_available,
        bp.floor_number,
        br.advance_amount,
        br.monthly_rent,
        br.lease_amount
        ${imageSelectSql}
      FROM businessownerdet bd
      LEFT JOIN businessownerpro bp ON bd.id = bp.businessownerdet_id
      LEFT JOIN businessownerrent br ON bd.id = br.businessownerdet_id
      WHERE bd.id = ?`,
      [id]
    );

    console.log('Database query result:', rows);

    if (rows.length === 0) return res.status(404).json({ message: 'Property not found' });

    const property = rows[0];

    const images = [];
    for (const imgCol of rentImgCols) {
      const raw = property[`br_${imgCol.col}`];
      if (imgCol.type === 'json' && raw) {
        try {
          const arr = typeof raw === 'string' ? JSON.parse(raw) : (Array.isArray(raw) ? raw : []);
          for (const item of arr) {
            const n = normalizeImageUrl(item, req);
            if (n) images.push(n);
          }
        } catch (_) {}
      } else if (imgCol.type === 'single' && raw) {
        const n = normalizeImageUrl(raw, req);
        if (n) images.push(n);
      }
      delete property[`br_${imgCol.col}`];
    }

    // Restructure the data to match the residential format
    const structuredData = {
      id: property.id,
      images: images,
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

    if (structuredData.images.length === 0) {
      let filenames = [];
      try {
        filenames = fs.existsSync(businessUploadsDir) ? fs.readdirSync(businessUploadsDir) : [];
      } catch (_) {
        filenames = [];
      }
      const origin = `${req.protocol}://${req.get('host')}`;
      const prefix = `business-${id}-`;
      structuredData.images = filenames
        .filter(fn => fn.startsWith(prefix))
        .map(fn => `${origin}/uploads/business/${fn}`);
    }

    console.log('Returning structured data:', structuredData);
    res.status(200).json(structuredData);
  } catch (error) {
    console.error('Error fetching business property details:', error);
    res.status(500).json({ message: 'Error fetching business property details', error: error.message });
  }
});

export default router;
