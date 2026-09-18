import { Router } from 'express';
import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const vehiclesUploadsDir = path.join(__dirname, '../uploads', 'vehicles');

// Robust helper to normalize image URLs into absolute URLs
const normalizeVehicleImageUrl = (url, req) => {
  if (!url) return null;
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http')) return trimmed;
  const host = req.get('host');
  const protocol = req.protocol;
  // Strip any leading slashes / uploads prefix so we always build a clean URL
  const basename = path.basename(trimmed);
  if (!basename) return null;
  return `${protocol}://${host}/uploads/vehicles/${basename}`;
};

// GET all available vehicles for tenant view
router.get('/available', async (req, res) => {
    try {
        const { type, rent, area } = req.query;

        let query = `
      SELECT 
        vd.id,
        vd.vehicle_type as type,
        vd.vehicle_name as name,
        vd.vehicle_model as model,
        vd.fuel_type as fuelType,
        vd.ac_charge_per_day as acPrice,
        vd.nonac_charge_per_day as nonAcPrice,
        vd.vehicle_images as images,
        vd.vehiclesowndet_id as voId,
        vo.area,
        vo.city
      FROM vehiclesdet vd
      INNER JOIN vehiclesowndet vo ON vd.vehiclesowndet_id = vo.id
    `;

        const conditions = [];
        const params = [];

        if (type && type !== '') {
            conditions.push('vd.vehicle_type = ?');
            params.push(type);
        }

        if (rent && rent !== '') {
            if (rent.includes('-')) {
                const [minRent, maxRent] = rent.split('-').map(Number);
                conditions.push('(vd.ac_charge_per_day BETWEEN ? AND ? OR vd.nonac_charge_per_day BETWEEN ? AND ?)');
                params.push(minRent, maxRent, minRent, maxRent);
            } else {
                conditions.push('(vd.ac_charge_per_day = ? OR vd.nonac_charge_per_day = ?)');
                params.push(Number(rent), Number(rent));
            }
        }

        if (area && area !== '') {
            conditions.push('vo.area LIKE ?');
            params.push(`%${area}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY vd.created_at DESC';

        const [rows] = await pool.execute(query, params);

        // Fallback: scan filesystem for vehicles-<voId>-* files if DB column is empty
        let diskFiles = [];
        try {
          diskFiles = fs.existsSync(vehiclesUploadsDir) ? fs.readdirSync(vehiclesUploadsDir) : [];
        } catch (_) { diskFiles = []; }

        const vehicles = rows.map(row => {
            let imgs = [];
            try {
                imgs = typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []);
            } catch (e) {
                console.error('Error parsing vehicle images:', e);
                imgs = [];
            }
            let normalized = Array.isArray(imgs)
              ? imgs.map(u => normalizeVehicleImageUrl(u, req)).filter(Boolean)
              : [];
            // Fallback: use filesystem pattern match vehicles-<voId>-* if no valid images from DB
            if (normalized.length === 0 && row.voId != null && diskFiles.length > 0) {
              const prefix = `vehicles-${row.voId}-`;
              const host = req.get('host');
              const protocol = req.protocol;
              normalized = diskFiles
                .filter(f => typeof f === 'string' && f.startsWith(prefix))
                .map(f => `${protocol}://${host}/uploads/vehicles/${f}`);
            }
            const nextRow = { ...row };
            delete nextRow.voId;
            return { ...nextRow, images: normalized };
        });

        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error fetching available vehicles:', error);
        res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
    }
});

// GET specific vehicle details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT 
        vd.*,
        vo.name_of_person,
        vo.contact_no,
        vo.area,
        vo.city,
        vo.street,
        vo.door_no,
        vo.pincode
      FROM vehiclesdet vd
      INNER JOIN vehiclesowndet vo ON vd.vehiclesowndet_id = vo.id
      WHERE vd.id = ?
    `;

        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const vehicle = rows[0];
        let imgs = [];
        try {
            imgs = typeof vehicle.vehicle_images === 'string' ? JSON.parse(vehicle.vehicle_images) : (vehicle.vehicle_images || []);
        } catch (e) {
            console.error('Error parsing vehicle_images:', e);
            imgs = [];
        }
        let normalized = Array.isArray(imgs)
          ? imgs.map(u => normalizeVehicleImageUrl(u, req)).filter(Boolean)
          : [];
        // Fallback: filesystem pattern
        if (normalized.length === 0 && vehicle.vehiclesowndet_id != null) {
          let diskFiles = [];
          try {
            diskFiles = fs.existsSync(vehiclesUploadsDir) ? fs.readdirSync(vehiclesUploadsDir) : [];
          } catch (_) { diskFiles = []; }
          const prefix = `vehicles-${vehicle.vehiclesowndet_id}-`;
          const host = req.get('host');
          const protocol = req.protocol;
          normalized = diskFiles
            .filter(f => typeof f === 'string' && f.startsWith(prefix))
            .map(f => `${protocol}://${host}/uploads/vehicles/${f}`);
        }
        vehicle.vehicle_images = normalized;
        vehicle.images = normalized;

        res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        res.status(500).json({ message: 'Error fetching vehicle details', error: error.message });
    }
});

export default router;
