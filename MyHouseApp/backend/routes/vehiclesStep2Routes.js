import { Router } from 'express';
import { pool } from '../config/database.js';
import upload from '../middleware/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Save vehicles step 2 details into vehiclesdet table
router.post('/vehicles/step2', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { voNo, vehicles, images } = req.body;
    console.log('Vehicles step2 payload received:', { voNo, vehicleCount: vehicles?.length, imageCount: images?.length });

    if (!voNo) {
      throw new Error("Vehicle owner ID (voNo) is required");
    }

    // Process vehicles (should be an array)
    const vehicleArray = Array.isArray(vehicles) ? vehicles : [vehicles];
    const imagesJson = JSON.stringify(images || []);

    for (const vehicle of vehicleArray) {
      const sql = `
        INSERT INTO vehiclesdet (
          vehiclesowndet_id,
          vehicle_type,
          vehicle_name,
          vehicle_model,
          seat_capacity,
          fuel_type,
          ac_charge_per_day,
          ac_charge_per_km,
          ac_waiting_charge_per_hour,
          ac_waiting_charge_per_night,
          ac_fixed,
          nonac_charge_per_day,
          nonac_charge_per_km,
          nonac_waiting_charge_per_hour,
          nonac_waiting_charge_per_night,
          nonac_fixed,
          vehicle_images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        voNo,
        vehicle.type,
        vehicle.name,
        vehicle.model,
        parseInt(vehicle.seatCapacity) || 0,
        vehicle.fuelType,
        // AC Pricing
        parseFloat(vehicle.ac_charge_per_day) || 0,
        parseFloat(vehicle.ac_charge_per_km) || 0,
        parseFloat(vehicle.ac_waiting_charge_per_hour) || 0,
        parseFloat(vehicle.ac_waiting_charge_per_night) || 0,
        vehicle.ac_fixed ? 1 : 0,
        // Non-AC Pricing
        parseFloat(vehicle.nonac_charge_per_day) || 0,
        parseFloat(vehicle.nonac_charge_per_km) || 0,
        parseFloat(vehicle.nonac_waiting_charge_per_hour) || 0,
        parseFloat(vehicle.nonac_waiting_charge_per_night) || 0,
        vehicle.nonac_fixed ? 1 : 0,
        imagesJson
      ];

      console.log('Executing SQL for vehicle:', vehicle.name);
      await connection.execute(sql, values);
    }

    await connection.commit();
    res.status(201).json({ message: 'Vehicles step2 saved successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error saving vehicles step2 details:', error);
    res.status(500).json({
      message: 'Error saving vehicles step2 details',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

// Upload vehicle images
router.post('/vehicles/images', upload.array('images', 12), async (req, res) => {
  try {
    const voNo = req.body?.voNo;
    if (!voNo) {
      return res.status(400).json({ message: 'voNo is required to associate images' });
    }
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }
    const baseDir = path.join(__dirname, '../uploads', 'vehicles');
    try { fs.mkdirSync(baseDir, { recursive: true }); } catch (_) {}
    const origin = `${req.protocol}://${req.get('host')}`;
    const urls = files.map(f => `${origin}/uploads/vehicles/${path.basename(f.filename || f.originalname)}`);
    res.status(201).json({ message: 'Images uploaded successfully', voNo, images: urls });
  } catch (error) {
    console.error('Error uploading vehicle images:', error);
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
});

export default router;
