import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

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

        // Parse images JSON for each vehicle
        const origin = `${req.protocol}://${req.get('host')}`;
        const vehicles = rows.map(row => {
            const imgs = typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []);
            const normalized = Array.isArray(imgs) ? imgs.map(u => (typeof u === 'string' && u.startsWith('http')) ? u : `${origin}${u}`) : [];
            return { ...row, images: normalized };
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
        const origin = `${req.protocol}://${req.get('host')}`;
        const imgs = typeof vehicle.vehicle_images === 'string' ? JSON.parse(vehicle.vehicle_images) : (vehicle.vehicle_images || []);
        vehicle.vehicle_images = Array.isArray(imgs) ? imgs.map(u => (typeof u === 'string' && u.startsWith('http')) ? u : `${origin}${u}`) : [];

        res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        res.status(500).json({ message: 'Error fetching vehicle details', error: error.message });
    }
});

export default router;
