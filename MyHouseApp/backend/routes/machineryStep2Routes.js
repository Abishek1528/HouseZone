import { Router } from 'express';
import { pool } from '../config/database.js';
import upload from '../middleware/upload.js';

const router = Router();

// API endpoint for uploading machinery images
router.post('/machinery/images', upload.array('images', 7), async (req, res) => {
  try {
    const { moNo } = req.body;
    if (!moNo) return res.status(400).json({ message: 'moNo (machinery owner id) is required' });
    
    const host = req.get('host');
    const protocol = req.protocol;
    const imageUrls = req.files.map(file => `${protocol}://${host}/uploads/machinery/${file.filename}`);
    
    res.status(200).json({
      message: 'Images uploaded successfully',
      images: imageUrls
    });
  } catch (error) {
    console.error('Error uploading machinery images:', error);
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
});

// Save machinery step 2 details into machinarydet table (robust column mapping)
router.post('/machinery/step2', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';
    let tableName = 'machinarydet';

    const payload = req.body || {};
    console.log('Machinery step2 payload:', JSON.stringify(payload, null, 2));

    // helper to load columns for a given table
    const loadColumns = async (tname) => {
      const [cols] = await pool.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
        [dbName, tname]
      );
      return cols.map(c => c.COLUMN_NAME.toLowerCase());
    };

    // Try multiple candidate table names to handle spelling variations
    const candidateTables = ['machinarydet', 'machinerydet', 'machinary_det', 'machinery_det'];
    let columnNames = [];
    for (const cand of candidateTables) {
      const cols = await loadColumns(cand);
      if (cols.length > 0) {
        tableName = cand;
        columnNames = cols;
        break;
      }
    }

    // If still nothing found, return a clear error
    if (columnNames.length === 0) {
      return res.status(404).json({ message: 'Machinery details table not found. Expected one of: ' + candidateTables.join(', ') });
    }

    console.log(`${tableName} columns:`, columnNames);
    // send columns back for debugging if needed
    res.setHeader('X-Machinery-Columns', columnNames.join(','));

    // util: normalize camelCase -> snake_case
    const normalize = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();

    // util: fuzzy column finder
    const findCol = (candidates) => {
      for (const cand of candidates) {
        const exact = columnNames.find(col => col === cand.toLowerCase());
        if (exact) return exact;
      }
      for (const cand of candidates) {
        const fuzzy = columnNames.find(col => col.includes(cand.toLowerCase()));
        if (fuzzy) return fuzzy;
      }
      return null;
    };

    // detect common columns
    const ownerIdCol = findCol(['machinaryowndet_id','mo_no','mono','owner_id','mo']);
    const machineryJsonCol = findCol(['machinery','machineries','details','data','payload','info','json']);
    const imagesCol = findCol(['images','machinery_images','photos','pictures','image_urls']);
    const typeCol = findCol(['type','machinery_type']);
    const nameCol = findCol(['name','machinery_name']);
    const modelCol = findCol(['model','machinery_model']);

    // pricing related columns if present
    const chargePerDayCol = findCol(['charge_per_day','day_charge']);
    const chargePerKmCol = findCol(['charge_per_km','km_charge']);
    const waitPerHourCol = findCol(['waiting_charge_per_hour','wait_per_hour']);
    const waitPerNightCol = findCol(['waiting_charge_per_night','wait_per_night']);
    const fixedCol = findCol(['is_fixed','fixed']);

    // explicit image columns (image1..image7)
    const explicitImageCols = [];
    for (let i = 1; i <= 7; i++) {
      const col = findCol([`image${i}`]);
      if (col) explicitImageCols.push({ col, idx: i - 1 });
    }

    // Ensure we capture owner id from payload
    const moNo = payload.moNo ?? payload.mo_no ?? payload.machinaryowndet_id ?? payload.ownerId ?? null;

    // Strategy 1: If table has granular columns (type/name/model), insert one row per machinery item
    if (typeCol || nameCol || modelCol) {
      const machineryArr = Array.isArray(payload.machinery) ? payload.machinery : [];
      if (machineryArr.length === 0) {
        // If no array, try to map single fields from payload root
        const single = {
          type: payload.type,
          name: payload.name,
          model: payload.model
        };
        if (single.type || single.name || single.model) {
          const cols = [];
          const vals = [];
          if (ownerIdCol && moNo !== null && moNo !== undefined) { cols.push(ownerIdCol); vals.push(moNo); }
          if (typeCol && single.type !== undefined) { cols.push(typeCol); vals.push(single.type); }
          if (nameCol && single.name !== undefined) { cols.push(nameCol); vals.push(single.name); }
          if (modelCol && single.model !== undefined) { cols.push(modelCol); vals.push(single.model); }
          // pricing if provided
          if (chargePerDayCol && payload.chargePerDay !== undefined) { cols.push(chargePerDayCol); vals.push(payload.chargePerDay); }
          if (chargePerKmCol && payload.chargePerKm !== undefined) { cols.push(chargePerKmCol); vals.push(payload.chargePerKm); }
          if (waitPerHourCol && payload.waitingChargePerHour !== undefined) { cols.push(waitPerHourCol); vals.push(payload.waitingChargePerHour); }
          if (waitPerNightCol && payload.waitingChargePerNight !== undefined) { cols.push(waitPerNightCol); vals.push(payload.waitingChargePerNight); }
          if (fixedCol && payload.fixed !== undefined) { cols.push(fixedCol); vals.push(payload.fixed === 'yes' || payload.fixed === true ? 1 : 0); }
          // images mapping
          const imgs = Array.isArray(payload.images) ? payload.images : [];
          if (imagesCol && imgs.length > 0) { cols.push(imagesCol); vals.push(JSON.stringify(imgs)); }
          if (explicitImageCols.length > 0) {
            explicitImageCols.forEach(({ col, idx }) => {
              cols.push(col);
              vals.push(imgs[idx] ?? '');
            });
          }
          if (cols.length === 0) {
            // fall through to other strategies
          } else {
            const placeholders = cols.map(() => '?').join(', ');
            const sql = `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${placeholders})`;
            console.log('Executing SQL (single machinery row):', sql, vals);
            await pool.execute(sql, vals);
            return res.status(201).json({ message: 'Machinery step2 saved successfully' });
          }
        }
      } else {
        // multiple rows
        for (const mach of machineryArr) {
          const cols = [];
          const vals = [];
          if (ownerIdCol && moNo !== null && moNo !== undefined) { cols.push(ownerIdCol); vals.push(moNo); }
          if (typeCol && mach.type !== undefined) { cols.push(typeCol); vals.push(mach.type); }
          if (nameCol && mach.name !== undefined) { cols.push(nameCol); vals.push(mach.name); }
          if (modelCol && mach.model !== undefined) { cols.push(modelCol); vals.push(mach.model); }
          // pricing if provided (apply same payload-level pricing to each row)
          if (chargePerDayCol && payload.chargePerDay !== undefined) { cols.push(chargePerDayCol); vals.push(payload.chargePerDay); }
          if (chargePerKmCol && payload.chargePerKm !== undefined) { cols.push(chargePerKmCol); vals.push(payload.chargePerKm); }
          if (waitPerHourCol && payload.waitingChargePerHour !== undefined) { cols.push(waitPerHourCol); vals.push(payload.waitingChargePerHour); }
          if (waitPerNightCol && payload.waitingChargePerNight !== undefined) { cols.push(waitPerNightCol); vals.push(payload.waitingChargePerNight); }
          if (fixedCol && payload.fixed !== undefined) { cols.push(fixedCol); vals.push(payload.fixed === 'yes' || payload.fixed === true ? 1 : 0); }
          // images mapping
          const imgs = Array.isArray(payload.images) ? payload.images : [];
          if (imagesCol && imgs.length > 0) { cols.push(imagesCol); vals.push(JSON.stringify(imgs)); }
          if (explicitImageCols.length > 0) {
            explicitImageCols.forEach(({ col, idx }) => {
              cols.push(col);
              vals.push(imgs[idx] ?? '');
            });
          }
          if (cols.length > 0) {
            const placeholders = cols.map(() => '?').join(', ');
            const sql = `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${placeholders})`;
            console.log('Executing SQL (machinery row):', sql, vals);
            await pool.execute(sql, vals);
          }
        }
        return res.status(201).json({ message: 'Machinery step2 saved successfully' });
      }
    }

    // Strategy 2: If table has JSON columns, insert compressed payload
    if (machineryJsonCol || imagesCol) {
      const cols = [];
      const vals = [];
      if (ownerIdCol && moNo !== null && moNo !== undefined) { cols.push(ownerIdCol); vals.push(moNo); }
      if (machineryJsonCol) { cols.push(machineryJsonCol); vals.push(JSON.stringify(payload.machinery ?? [])); }
      if (imagesCol) { cols.push(imagesCol); vals.push(JSON.stringify(payload.images ?? [])); }
      if (cols.length > 0) {
        const placeholders = cols.map(() => '?').join(', ');
        const sql = `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${placeholders})`;
        console.log('Executing SQL (json payload):', sql, vals);
        await pool.execute(sql, vals);
        return res.status(201).json({ message: 'Machinery step2 saved successfully' });
      }
    }

    // Strategy 3: Generic mapping of normalized keys to table columns
    const insertCols = [];
    const insertVals = [];
    Object.entries(payload).forEach(([key, value]) => {
      let columnKey = normalize(key);
      if (key === 'moNo' && ownerIdCol) {
        columnKey = ownerIdCol;
      } else if (!columnNames.includes(columnKey) && columnNames.includes(key.toLowerCase())) {
        columnKey = key.toLowerCase();
      }
      if (columnNames.includes(columnKey)) {
        insertCols.push(columnKey);
        insertVals.push(typeof value === 'object' && value !== null ? JSON.stringify(value) : value);
      }
    });

    const placeholders = insertCols.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${insertCols.join(', ')}) VALUES (${placeholders})`;
    console.log('Executing SQL:', sql);
    console.log('Values:', insertVals);

    if (insertCols.length > 0) {
      await pool.execute(sql, insertVals);
      return res.status(201).json({ message: 'Machinery step2 saved successfully' });
    }

    // Final fallback: insert entire payload into any generic column present
    const fallbackCol = columnNames.find(c => ['data','payload','info','details','json'].includes(c));
    if (fallbackCol) {
      console.log('No direct matches; inserting entire payload into', fallbackCol);
      await pool.execute(`INSERT INTO ${tableName} (${fallbackCol}) VALUES (?)`, [JSON.stringify(payload)]);
      return res.status(201).json({ message: 'Machinery step2 saved successfully (fallback)' });
    }

    return res.status(400).json({ message: 'No matching columns found in ' + tableName, columns: columnNames });
  } catch (error) {
    console.error('Error saving machinery step2 details:', error);
    res.status(500).json({ message: 'Error saving machinery step2 details', error: error.message });
  }
});

export default router;
