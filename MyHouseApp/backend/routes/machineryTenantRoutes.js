import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET all machinery for tenant view
router.get('/machinery/properties', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';

    // Dynamically get column names to build a robust query
    const [ownerCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'machinaryowndet'`,
      [dbName]
    );
    const [detailCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'machinarydet'`,
      [dbName]
    );

    if (ownerCols.length === 0 || detailCols.length === 0) {
      console.log('One or both machinery tables not found, returning empty array.');
      return res.status(200).json([]);
    }

    const ownerColumnNames = ownerCols.map(c => c.COLUMN_NAME.toLowerCase());
    const detailColumnNames = detailCols.map(c => c.COLUMN_NAME.toLowerCase());

    const findCol = (columns, candidates) => {
      for (const cand of candidates) {
        const found = columns.find(col => col.includes(cand.toLowerCase()));
        if (found) return found;
      }
      return null;
    };

    // --- Column Mappings ---
    // Owner details (excluding sensitive info)
    const ownerIdCol = findCol(ownerColumnNames, ['id', 'mo_no']) || 'id';
    const areaCol = findCol(ownerColumnNames, ['area', 'location']);
    const cityCol = findCol(ownerColumnNames, ['city']);

    // Machinery details
    const detailIdCol = findCol(detailColumnNames, ['id', 'machinery_id']) || 'id';
    const ownerFkCol = findCol(detailColumnNames, ['owner_id', 'machinaryowndet_id', 'mo_no']) || 'owner_id';
    const typeCol = findCol(detailColumnNames, ['machinery_type', 'type']);
    const nameCol = findCol(detailColumnNames, ['machinery_name', 'name']);
    const modelCol = findCol(detailColumnNames, ['machinery_model', 'model']);
    const imagesCol = findCol(detailColumnNames, ['image1', 'images', 'image_urls']); // Prioritize image1 if it exists

    // Pricing columns
    const chargeDayCol = findCol(detailColumnNames, ['charge_per_day']);
    const chargeKmCol = findCol(detailColumnNames, ['charge_per_km']);
    const waitingHourCol = findCol(detailColumnNames, ['waiting_charge_per_hour']);
    const waitingNightCol = findCol(detailColumnNames, ['waiting_charge_per_night']);
    const fixedCol = findCol(detailColumnNames, ['is_fixed', 'fixed']);

    // Construct the query dynamically
    const query = `
      SELECT
        md.${detailIdCol} as id,
        mo.${areaCol} as area,
        mo.${cityCol} as city,
        md.${typeCol} as type,
        md.${nameCol} as name,
        md.${modelCol} as model,
        md.${chargeDayCol} as chargePerDay,
        md.${chargeKmCol} as chargePerKm,
        md.${waitingHourCol} as waitingChargePerHour,
        md.${waitingNightCol} as waitingChargePerNight,
        md.${fixedCol} as isFixed,
        md.image1, md.image2, md.image3, md.image4, md.image5, md.image6, md.image7
      FROM machinarydet md
      JOIN machinaryowndet mo ON md.${ownerFkCol} = mo.${ownerIdCol}
      ORDER BY md.${detailIdCol} DESC
    `;

    const [rows] = await pool.execute(query);

    // Process rows to group images
    const machineryList = rows.map(row => {
      const images = [];
      for (let i = 1; i <= 7; i++) {
        if (row[`image${i}`]) {
          images.push(row[`image${i}`]);
        }
        delete row[`image${i}`];
      }
      return { ...row, images };
    });

    res.status(200).json(machineryList);

  } catch (error) {
    console.error('Error fetching machinery properties for tenant:', error);
    res.status(500).json({ message: 'Failed to fetch machinery properties', error: error.message });
  }
});


router.get('/machinery/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbName = process.env.DB_NAME || 'cdmrental';

    const [ownerCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'machinaryowndet'`,
      [dbName]
    );
    const [detailCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'machinarydet'`,
      [dbName]
    );

    if (ownerCols.length === 0 || detailCols.length === 0) {
      return res.status(404).json({ message: "Machinery tables not found." });
    }

    const ownerColumnNames = ownerCols.map(c => c.COLUMN_NAME.toLowerCase());
    const detailColumnNames = detailCols.map(c => c.COLUMN_NAME.toLowerCase());

    const findCol = (columns, candidates) => {
      for (const cand of candidates) {
        const found = columns.find(col => col.includes(cand.toLowerCase()));
        if (found) return found;
      }
      return null;
    };

    const ownerIdCol = findCol(ownerColumnNames, ['id', 'mo_no']) || 'id';
    const areaCol = findCol(ownerColumnNames, ['area', 'location']);
    const cityCol = findCol(ownerColumnNames, ['city']);

    const detailIdCol = findCol(detailColumnNames, ['id', 'machinery_id']) || 'id';
    const ownerFkCol = findCol(detailColumnNames, ['owner_id', 'machinaryowndet_id', 'mo_no']) || 'owner_id';
    const typeCol = findCol(detailColumnNames, ['machinery_type', 'type']);
    const nameCol = findCol(detailColumnNames, ['machinery_name', 'name']);
    const modelCol = findCol(detailColumnNames, ['machinery_model', 'model']);
    const chargeDayCol = findCol(detailColumnNames, ['charge_per_day']);
    const chargeKmCol = findCol(detailColumnNames, ['charge_per_km']);
    const waitingHourCol = findCol(detailColumnNames, ['waiting_charge_per_hour']);
    const waitingNightCol = findCol(detailColumnNames, ['waiting_charge_per_night']);
    const fixedCol = findCol(detailColumnNames, ['is_fixed', 'fixed']);

    const query = `
      SELECT
        md.${detailIdCol} as id,
        mo.${areaCol} as area,
        mo.${cityCol} as city,
        md.${typeCol} as type,
        md.${nameCol} as name,
        md.${modelCol} as model,
        md.${chargeDayCol} as chargePerDay,
        md.${chargeKmCol} as chargePerKm,
        md.${waitingHourCol} as waitingChargePerHour,
        md.${waitingNightCol} as waitingChargePerNight,
        md.${fixedCol} as isFixed,
        md.image1, md.image2, md.image3, md.image4, md.image5, md.image6, md.image7
      FROM machinarydet md
      JOIN machinaryowndet mo ON md.${ownerFkCol} = mo.${ownerIdCol}
      WHERE md.${detailIdCol} = ?
    `;

    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Machinery not found." });
    }

    const detail = rows[0];
    const images = [];
    for (let i = 1; i <= 7; i++) {
      if (detail[`image${i}`]) {
        images.push(detail[`image${i}`]);
      }
      delete detail[`image${i}`];
    }
    detail.images = images;

    res.status(200).json(detail);

  } catch (error) {
    console.error(`Error fetching machinery details for id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch machinery details', error: error.message });
  }
});

export default router;
