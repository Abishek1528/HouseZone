import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET all business properties for tenant view
router.get('/business/properties', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';
    const { rent, area, propertyType } = req.query;

    // Get column names for the tables to build dynamic query
    const [detCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'businessownerdet'`,
      [dbName]
    );
    
    const [proCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'businessownerpro'`,
      [dbName]
    );
    
    const [rentCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'businessownerrent'`,
      [dbName]
    );

    const detColumnNames = detCols.map(c => c.COLUMN_NAME.toLowerCase());
    const proColumnNames = proCols.map(c => c.COLUMN_NAME.toLowerCase());
    const rentColumnNames = rentCols.map(c => c.COLUMN_NAME.toLowerCase());

    // Helper to find a column by possible name fragments
    const findCol = (columnNames, candidates) => {
      for (const cand of candidates) {
        const found = columnNames.find(col => col.includes(cand.toLowerCase()));
        if (found) return found;
      }
      return null;
    };

    // Find the primary key in businessownerdet table
    const detPk = findCol(detColumnNames, ['id', 'bo_no', 'bono']) || 'id';
    
    // Find the foreign key columns in other tables
    const proFk = findCol(proColumnNames, ['bo', 'bono', 'owner_id', 'ownerno', 'id']) || detPk;
    const rentFk = findCol(rentColumnNames, ['bo', 'bono', 'owner_id', 'ownerno', 'id']) || detPk;

    // Find other columns
    const areaCol = findCol(detColumnNames, ['area', 'location']);
    const propertyTypeCol = findCol(proColumnNames, ['property', 'type']);
    const monthlyRentCol = findCol(rentColumnNames, ['rent', 'monthly_rent']);
    const leaseAmountCol = findCol(rentColumnNames, ['lease', 'lease_amount']);

    let query = `SELECT
      bd.${detPk} as id,
      bd.${areaCol} as area,
      bp.${propertyTypeCol} as propertyType,
      br.${monthlyRentCol} as monthlyRent,
      br.${leaseAmountCol} as leaseAmount
    FROM businessownerdet bd
    LEFT JOIN businessownerpro bp ON bd.${detPk} = bp.${proFk}
    LEFT JOIN businessownerrent br ON bd.${detPk} = br.${rentFk}`;

    const conditions = [];
    const params = [];

    if (rent) {
      if (rent.includes('-')) {
        const [minRent, maxRent] = rent.split('-').map(Number);
        conditions.push(`(br.${monthlyRentCol} BETWEEN ? AND ? OR br.${leaseAmountCol} BETWEEN ? AND ?)`);
        params.push(minRent, maxRent, minRent, maxRent);
      } else {
        conditions.push(`(br.${monthlyRentCol} = ? OR br.${leaseAmountCol} = ?)`);
        params.push(Number(rent), Number(rent));
      }
    }

    if (area && area !== '') {
      conditions.push(`bd.${areaCol} LIKE ?`);
      params.push(`%${area}%`);
    }

    if (propertyType && propertyType !== '') {
      conditions.push(`bp.${propertyTypeCol} = ?`);
      params.push(propertyType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY bd.${detPk} DESC`;

    const [rows] = await pool.execute(query, params);
    res.status(200).json(rows);
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

    // Get column names for the tables to build dynamic query
    const [detCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'businessownerdet'`,
      [dbName]
    );
    
    const [proCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'businessownerpro'`,
      [dbName]
    );
    
    const [rentCols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'businessownerrent'`,
      [dbName]
    );

    const detColumnNames = detCols.map(c => c.COLUMN_NAME.toLowerCase());
    const proColumnNames = proCols.map(c => c.COLUMN_NAME.toLowerCase());
    const rentColumnNames = rentCols.map(c => c.COLUMN_NAME.toLowerCase());

    // Helper to find a column by possible name fragments
    const findCol = (columnNames, candidates) => {
      for (const cand of candidates) {
        const found = columnNames.find(col => col.includes(cand.toLowerCase()));
        if (found) return found;
      }
      return null;
    };

    // Find the primary key in businessownerdet table
    const detPk = findCol(detColumnNames, ['id', 'bo_no', 'bono']) || 'id';
    
    // Find the foreign key columns in other tables
    const proFk = findCol(proColumnNames, ['bo', 'bono', 'owner_id', 'ownerno', 'id']) || detPk;
    const rentFk = findCol(rentColumnNames, ['bo', 'bono', 'owner_id', 'ownerno', 'id']) || detPk;

    // Find all the columns we need
    const nameCol = findCol(detColumnNames, ['name', 'person', 'owner']);
    const doorNoCol = findCol(detColumnNames, ['door', 'no']);
    const streetCol = findCol(detColumnNames, ['street', 'address']);
    const areaCol = findCol(detColumnNames, ['area', 'location']);
    const pincodeCol = findCol(detColumnNames, ['pin', 'pincode', 'postal']);
    const cityCol = findCol(detColumnNames, ['city']);
    const contactCol = findCol(detColumnNames, ['contact', 'phone', 'phno']);
    const doorFacingCol = findCol(proColumnNames, ['facing', 'door_facing']);
    const propertyTypeCol = findCol(proColumnNames, ['property', 'type']);
    const lengthCol = findCol(proColumnNames, ['length', 'length_feet']);
    const breadthCol = findCol(proColumnNames, ['breadth', 'breadth_feet']);
    const restroomCol = findCol(proColumnNames, ['restroom', 'toilet', 'available']);
    const floorCol = findCol(proColumnNames, ['floor', 'number']);
    const advanceCol = findCol(rentColumnNames, ['advance', 'advance_amount']);
    const monthlyRentCol = findCol(rentColumnNames, ['rent', 'monthly_rent']);
    const leaseCol = findCol(rentColumnNames, ['lease', 'lease_amount']);

    const [rows] = await pool.execute(
      `SELECT
        bd.${detPk} as id,
        bd.${nameCol} as ownerName,
        bd.${doorNoCol} as doorNo,
        bd.${streetCol} as street,
        bd.${areaCol} as area,
        bd.${pincodeCol} as pincode,
        bd.${cityCol} as city,
        bd.${contactCol} as contactNo,
        bp.${doorFacingCol} as doorFacing,
        bp.${propertyTypeCol} as propertyType,
        bp.${lengthCol} as lengthFeet,
        bp.${breadthCol} as breadthFeet,
        bp.${restroomCol} as restroomAvailable,
        bp.${floorCol} as floorNumber,
        br.${advanceCol} as advanceAmount,
        br.${monthlyRentCol} as monthlyRent,
        br.${leaseCol} as leaseAmount
      FROM businessownerdet bd
      LEFT JOIN businessownerpro bp ON bd.${detPk} = bp.${proFk}
      LEFT JOIN businessownerrent br ON bd.${detPk} = br.${rentFk}
      WHERE bd.${detPk} = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Property not found' });

    const detail = rows[0];
    // Calculate total area if available
    if (detail.lengthFeet && detail.breadthFeet) {
      detail.totalArea = (parseFloat(detail.lengthFeet) * parseFloat(detail.breadthFeet)).toFixed(2);
    }

    res.status(200).json(detail);
  } catch (error) {
    console.error('Error fetching business property details:', error);
    res.status(500).json({ message: 'Error fetching business property details', error: error.message });
  }
});

export default router;
