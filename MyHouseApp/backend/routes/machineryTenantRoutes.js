import { Router } from 'express';
import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const machineryUploadsDir = path.join(__dirname, '../uploads', 'machinery');

// Helper to normalize image URLs
const normalizeImageUrl = (url, req) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const host = req.get('host');
  const protocol = req.protocol;
  return `${protocol}://${host}/uploads/machinery/${path.basename(url)}`;
};

// GET all machinery for tenant view
router.get('/machinery/properties', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'cdmrental';

    const query = `
      SELECT
        md.owner_id as id,
        mo.area,
        mo.city,
        md.machinery_type,
        md.machinery_name,
        md.machinery_model,
        md.charge_per_day,
        md.charge_per_km,
        md.waiting_charge_per_hour,
        md.waiting_charge_per_night,
        md.is_fixed,
        md.image1, md.image2, md.image3, md.image4, md.image5, md.image6, md.image7,
        mo.id as moNo
      FROM machinarydet md
      JOIN machinaryowndet mo ON md.owner_id = mo.id
      ORDER BY md.owner_id DESC
    `;

    const [rows] = await pool.execute(query);

    // Process rows to group images
    const machineryList = rows.map(row => {
      const images = [];
      
      // Add explicit columns images
      for (let i = 1; i <= 7; i++) {
        const img = row[`image${i}`];
        if (img) {
          images.push(normalizeImageUrl(img, req));
        }
        delete row[`image${i}`];
      }
      
      // Also look for files matching machinery-<moNo>- prefix if no images found in columns
      if (images.length === 0 && fs.existsSync(machineryUploadsDir)) {
        try {
          const files = fs.readdirSync(machineryUploadsDir);
          const prefix = `machinery-${row.moNo}-`;
          const matching = files
            .filter(f => f.startsWith(prefix))
            .map(f => `${req.protocol}://${req.get('host')}/uploads/machinery/${f}`);
          images.push(...matching);
        } catch (_) {}
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

    const query = `
      SELECT
        md.owner_id as id,
        mo.area,
        mo.city,
        md.machinery_type,
        md.machinery_name,
        md.machinery_model,
        md.charge_per_day,
        md.charge_per_km,
        md.waiting_charge_per_hour,
        md.waiting_charge_per_night,
        md.is_fixed,
        md.image1, md.image2, md.image3, md.image4, md.image5, md.image6, md.image7,
        mo.id as moNo
      FROM machinarydet md
      JOIN machinaryowndet mo ON md.owner_id = mo.id
      WHERE md.owner_id = ?
    `;

    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Machinery not found." });
    }

    const detail = rows[0];
    const images = [];
    for (let i = 1; i <= 7; i++) {
      const img = detail[`image${i}`];
      if (img) {
        images.push(normalizeImageUrl(img, req));
      }
      delete detail[`image${i}`];
    }
    
    // Fallback for filesystem images
    if (images.length === 0 && fs.existsSync(machineryUploadsDir)) {
      try {
        const files = fs.readdirSync(machineryUploadsDir);
        const prefix = `machinery-${detail.moNo}-`;
        const matching = files
          .filter(f => f.startsWith(prefix))
          .map(f => `${req.protocol}://${req.get('host')}/uploads/machinery/${f}`);
        images.push(...matching);
      } catch (_) {}
    }
    
    detail.images = images;

    res.status(200).json(detail);

  } catch (error) {
    console.error(`Error fetching machinery details for id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch machinery details', error: error.message });
  }
});

export default router;
