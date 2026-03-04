import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

// GET all business owners with property and rent details for admin
router.get('/business/owners', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';

    const loadCols = async (table) => {
      const [cols] = await pool.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
        [dbName, table]
      );
      return cols.map(c => c.COLUMN_NAME.toLowerCase());
    };

    const detCols = await loadCols('businessownerdet');
    const proCols = await loadCols('businessownerpro');
    const rentCols = await loadCols('businessownerrent');

    const findCol = (columnNames, candidates, fallback = null) => {
      for (const cand of candidates) {
        const exact = columnNames.find(col => col === cand.toLowerCase());
        if (exact) return exact;
      }
      for (const cand of candidates) {
        const fuzzy = columnNames.find(col => col.includes(cand.toLowerCase()));
        if (fuzzy) return fuzzy;
      }
      return fallback;
    };

    const detPk = findCol(detCols, ['id', 'bo_no', 'bono'], 'id');
    const proFk = findCol(proCols, ['bo', 'bono', 'owner_id', 'ownerno', 'id'], detPk);
    const rentFk = findCol(rentCols, ['bo', 'bono', 'owner_id', 'ownerno', 'id'], detPk);

    const nameCol = findCol(detCols, ['name', 'person', 'owner']);
    const doorNoCol = findCol(detCols, ['door', 'door_no', 'doorno']);
    const streetCol = findCol(detCols, ['street', 'address']);
    const areaCol = findCol(detCols, ['area', 'location']);
    const pincodeCol = findCol(detCols, ['pin', 'pincode', 'postal', 'zipcode']);
    const cityCol = findCol(detCols, ['city']);
    const contactCol = findCol(detCols, ['contact', 'phone', 'phno']);

    const doorFacingCol = findCol(proCols, ['facing', 'door_facing']);
    const propertyTypeCol = findCol(proCols, ['property', 'type']);
    const lengthCol = findCol(proCols, ['length', 'length_feet', 'area_length']);
    const breadthCol = findCol(proCols, ['breadth', 'breadth_feet', 'area_breadth']);
    const restroomCol = findCol(proCols, ['restroom', 'toilet', 'available']);
    const floorCol = findCol(proCols, ['floor', 'number', 'floor_number']);

    const advanceCol = findCol(rentCols, ['advance', 'advance_amount']);
    const monthlyRentCol = findCol(rentCols, ['rent', 'monthly_rent']);
    const leaseAmountCol = findCol(rentCols, ['lease', 'lease_amount']);

    const query = `
      SELECT 
        det.${detPk} as id,
        det.${nameCol} as ownerName,
        det.${doorNoCol} as doorNo,
        det.${streetCol} as street,
        det.${areaCol} as area,
        det.${pincodeCol} as pincode,
        det.${cityCol} as city,
        det.${contactCol} as contactNo,
        pro.${doorFacingCol} as doorFacing,
        pro.${propertyTypeCol} as propertyType,
        pro.${lengthCol} as areaLength,
        pro.${breadthCol} as areaBreadth,
        pro.${restroomCol} as restroomAvailable,
        pro.${floorCol} as floorNumber,
        rent.${advanceCol} as advanceAmount,
        rent.${monthlyRentCol} as monthlyRent,
        rent.${leaseAmountCol} as leaseAmount
      FROM businessownerdet det
      LEFT JOIN businessownerpro pro ON det.${detPk} = pro.${proFk}
      LEFT JOIN businessownerrent rent ON det.${detPk} = rent.${rentFk}
      ORDER BY det.${detPk} DESC
    `;

    const [rows] = await pool.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching business owners:', error);
    res.status(500).json({ message: 'Error fetching business owners', error: error.message });
  }
});

export default router;
