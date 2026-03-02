import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET all available vehicles for tenant view
router.get('/available', async (req, res) => {
    try {
        const query = `
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
      ORDER BY vd.created_at DESC
    `;

        const [rows] = await pool.execute(query);

        // Parse images JSON for each vehicle
        const vehicles = rows.map(row => ({
            ...row,
            images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images
        }));

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
        vo.name_of_person as ownerName,
        vo.contact_no as contactNo,
        vo.area,
        vo.city,
        vo.street,
        vo.door_no as doorNo,
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
        vehicle.vehicle_images = typeof vehicle.vehicle_images === 'string' ? JSON.parse(vehicle.vehicle_images) : vehicle.vehicle_images;

        res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        res.status(500).json({ message: 'Error fetching vehicle details', error: error.message });
    }
});

export default router;
