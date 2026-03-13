import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET all available vehicles for tenant view
router.get('/available', async (req, res) => {
    try {
        const query = `
      SELECT 
        vd.id,
        vd.vehicle_type,
        vd.vehicle_name,
        vd.vehicle_model,
        vd.fuel_type,
        vd.ac_charge_per_day,
        vd.nonac_charge_per_day,
        vd.vehicle_images,
        vo.area,
        vo.city
      FROM vehiclesdet vd
      INNER JOIN vehiclesowndet vo ON vd.vehiclesowndet_id = vo.id
      ORDER BY vd.created_at DESC
    `;

        const [rows] = await pool.execute(query);

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
