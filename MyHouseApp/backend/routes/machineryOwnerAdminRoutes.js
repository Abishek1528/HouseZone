import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET all machinery owners with their machinery details for admin view
router.get('/machinery/owners', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';

    // Get column names for both tables to build dynamic query
    const [ownerCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'machinaryowndet'`,
      [dbName]
    );
    
    const [machCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'machinarydet'`,
      [dbName]
    );

    if (ownerCols.length === 0 || machCols.length === 0) {
      return res.status(200).json([]);
    }

    const ownerColumnNames = ownerCols.map(c => c.COLUMN_NAME.toLowerCase());
    const machColumnNames = machCols.map(c => c.COLUMN_NAME.toLowerCase());

    const findCol = (columns, candidates) => {
      for (const cand of candidates) {
        const found = columns.find(col => col.includes(cand.toLowerCase()));
        if (found) return found;
      }
      return null;
    };

    // Owner table columns
    const ownerPk = findCol(ownerColumnNames, ['id', 'mo_no']) || 'id';
    const nameCol = findCol(ownerColumnNames, ['name', 'person', 'owner']);
    const contactCol = findCol(ownerColumnNames, ['contact', 'phone', 'phno']);
    const areaCol = findCol(ownerColumnNames, ['area', 'location']);
    const cityCol = findCol(ownerColumnNames, ['city']);
    const streetCol = findCol(ownerColumnNames, ['street', 'address']);
    const doorNoCol = findCol(ownerColumnNames, ['door', 'no']);
    const pinCol = findCol(ownerColumnNames, ['pin', 'pincode', 'postal']);

    // Machinery table columns
    const machIdCol = findCol(machColumnNames, ['id', 'machinery_id']) || 'id';
    const machFk = findCol(machColumnNames, ['owner_id', 'machinaryowndet_id', 'mo_no']) || 'owner_id';
    const typeCol = findCol(machColumnNames, ['machinery_type', 'type']);
    const vNameCol = findCol(machColumnNames, ['machinery_name', 'name']);
    const modelCol = findCol(machColumnNames, ['machinery_model', 'model']);
    const chargeDayCol = findCol(machColumnNames, ['charge_per_day']);
    const chargeKmCol = findCol(machColumnNames, ['charge_per_km']);
    const waitHrCol = findCol(machColumnNames, ['waiting_charge_per_hour']);
    const waitNightCol = findCol(machColumnNames, ['waiting_charge_per_night']);
    const fixedCol = findCol(machColumnNames, ['is_fixed', 'fixed']);
    const createdCol = findCol(machColumnNames, ['created_at']) || machIdCol;

    const query = `
      SELECT 
        mo.${ownerPk} as ownerId,
        mo.${nameCol} as ownerName,
        mo.${contactCol} as contactNo,
        mo.${areaCol} as area,
        mo.${cityCol} as city,
        mo.${streetCol} as street,
        mo.${doorNoCol} as doorNo,
        mo.${pinCol} as pincode,
        md.${machIdCol} as machineryId,
        md.${typeCol} as type,
        md.${vNameCol} as name,
        md.${modelCol} as model,
        md.${chargeDayCol} as chargePerDay,
        md.${chargeKmCol} as chargePerKm,
        md.${waitHrCol} as waitingChargePerHour,
        md.${waitNightCol} as waitingChargePerNight,
        md.${fixedCol} as isFixed,
        md.image1, md.image2, md.image3, md.image4, md.image5, md.image6, md.image7
      FROM machinarydet md
      INNER JOIN machinaryowndet mo ON md.${machFk} = mo.${ownerPk}
      ORDER BY md.${createdCol} DESC
    `;

    const [rows] = await pool.execute(query);
    
    const results = rows.map(row => {
      const images = [];
      for (let i = 1; i <= 7; i++) {
        if (row[`image${i}`]) images.push(row[`image${i}`]);
        delete row[`image${i}`];
      }
      return { ...row, images };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching machinery owners for admin:', error);
    res.status(500).json({ message: 'Error fetching machinery owners', error: error.message });
  }
});

export default router;
