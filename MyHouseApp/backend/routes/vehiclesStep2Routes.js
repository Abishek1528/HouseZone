import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

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

export default router;