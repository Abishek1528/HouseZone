import { Router } from 'express';
import { pool } from '../config/database.js';
import upload from '../middleware/upload.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jobGiverUploadsDir = path.join(__dirname, '../uploads', 'jobgiver');
if (!fs.existsSync(jobGiverUploadsDir)) {
  try { fs.mkdirSync(jobGiverUploadsDir, { recursive: true }); } catch (_) {}
}

// Save job giver step 1 (personal info)
router.post('/jobgiver/step1', async (req, res) => {
  try {
    console.log('Step 1 req.body:', req.body);
    const { name, ownerName, shopName, shopType, area, city, landmark, contact } = req.body;

    // Accept either ownerName (new) or name (old) field, prefer ownerName
    const finalName = ownerName || name;

    // Convert undefined to null
    const values = [
      finalName,
      shopName,
      shopType,
      area,
      city,
      landmark !== undefined ? landmark : null,
      contact
    ];

    console.log('Inserting into jobgiverdet with values:', values);
    const sql = `INSERT INTO jobgiverdet (name, shop_name, shop_type, area, city, landmark, contact) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, values);
    console.log('Insert result:', result);

    res.status(201).json({ jobGiverId: result.insertId, message: 'Job giver step 1 saved successfully' });
  } catch (error) {
    console.error('Error saving job giver step 1:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error saving job giver step 1', error: error.message });
  }
});

// Save job giver step 2 (job details)
router.post('/jobgiver/step2', async (req, res) => {
  try {
    console.log('Step 2 req.body:', req.body);
    const { jobGiverId, jobTitle, employmentType, age, gender, education, experienceYear, experienceField, workingTimeStart, workingTimeEnd, workTimings, workingTimings } = req.body;

    // Accept either workingTimings or workTimings
    const finalWorkingTimings = workingTimings || workTimings || null;

    console.log('Inserting into jobgiverjob with values:', [jobGiverId, jobTitle, employmentType, age, gender, education, experienceYear, experienceField, workingTimeStart, workingTimeEnd, finalWorkingTimings]);
    const sql = `INSERT INTO jobgiverjob (jobgiverdet_id, job_title, employment_type, age, gender, education, experience_year, experience_field, working_time_start, working_time_end, working_timings) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await pool.execute(sql, [jobGiverId, jobTitle, employmentType, age, gender, education, experienceYear, experienceField, workingTimeStart, workingTimeEnd, finalWorkingTimings]);

    res.status(201).json({ message: 'Job giver step 2 saved successfully' });
  } catch (error) {
    console.error('Error saving job giver step 2:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error saving job giver step 2', error: error.message });
  }
});

// Save job giver step 3 (salary, skills, photos)
router.post('/jobgiver/step3', upload.fields([{ name: 'shopPhoto1' }, { name: 'shopPhoto2' }, { name: 'shopPhoto3' }]), async (req, res) => {
  try {
    console.log('Step 3 req.body:', req.body);
    console.log('Step 3 req.files:', req.files);
    const { jobGiverId, salaryOffering, otherSkills } = req.body;
    const files = req.files || {};

    let shopPhoto1Path = null;
    let shopPhoto2Path = null;
    let shopPhoto3Path = null;

    if (files.shopPhoto1 && files.shopPhoto1[0]) {
      shopPhoto1Path = files.shopPhoto1[0].filename;
    }
    if (files.shopPhoto2 && files.shopPhoto2[0]) {
      shopPhoto2Path = files.shopPhoto2[0].filename;
    }
    if (files.shopPhoto3 && files.shopPhoto3[0]) {
      shopPhoto3Path = files.shopPhoto3[0].filename;
    }

    // Convert undefined to null
    const values = [
      jobGiverId,
      salaryOffering,
      otherSkills !== undefined ? otherSkills : null,
      shopPhoto1Path,
      shopPhoto2Path,
      shopPhoto3Path
    ];

    console.log('Inserting into jobgiversalary with values:', values);
    const sql = `INSERT INTO jobgiversalary (jobgiverdet_id, salary_offering, other_skills, shop_photo1, shop_photo2, shop_photo3) VALUES (?, ?, ?, ?, ?, ?)`;
    await pool.execute(sql, values);

    res.status(201).json({ message: 'Job giver step 3 saved successfully' });
  } catch (error) {
    console.error('Error saving job giver step 3:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error saving job giver step 3', error: error.message });
  }
});

// Debug route: check jobgiver tables
router.get('/jobgiver/debug/columns', async (req, res) => {
  try {
    const dbName = process.env.DB_NAME || 'defaultdb';
    const tables = [
      'jobgiverdet',
      'jobgiverjob',
      'jobgiversalary'
    ];

    const result = {};

    for (const tbl of tables) {
      const [cols] = await pool.execute(
        `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION`,
        [dbName, tbl]
      );

      result[tbl] = cols.map(c => ({ column: c.COLUMN_NAME, type: c.DATA_TYPE }));
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching jobgiver debug columns:', error);
    res.status(500).json({ message: 'Error fetching columns', error: error.message });
  }
});

// Get all job seekers for job giver (optionally filtered by jobGiverId)
router.get('/jobgiver/jobseekers', async (req, res) => {
  try {
    const { jobGiverId } = req.query;
    
    let sql = `SELECT js.*, jd.shop_name, jd.shop_type, jd.area AS shop_area, jd.city AS shop_city FROM jobseeker js LEFT JOIN jobgiverdet jd ON js.job_giver_job_id = jd.id`;
    const params = [];
    
    if (jobGiverId) {
      sql += ` WHERE js.job_giver_job_id = ?`;
      params.push(jobGiverId);
    }
    
    sql += ` ORDER BY js.created_at DESC`;
    
    const [rows] = await pool.execute(sql, params);
    
    const convertKeysToCamelCase = (obj) => {
      return Object.keys(obj).reduce((result, key) => {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        result[camelKey] = obj[key];
        return result;
      }, {});
    };
    
    const camelCaseRows = rows.map(convertKeysToCamelCase);
    res.status(200).json(camelCaseRows);
  } catch (error) {
    console.error('Error fetching job seekers:', error);
    res.status(500).json({ message: 'Error fetching job seekers', error: error.message });
  }
});

// Get single job seeker details by id
router.get('/jobgiver/jobseekers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT js.*, jd.shop_name, jd.shop_type, jd.area AS shop_area, jd.city AS shop_city FROM jobseeker js LEFT JOIN jobgiverdet jd ON js.job_giver_job_id = jd.id WHERE js.id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }
    
    // Convert snake_case to camelCase
    const convertKeysToCamelCase = (obj) => {
      return Object.keys(obj).reduce((result, key) => {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        result[camelKey] = obj[key];
        return result;
      }, {});
    };
    
    const camelCaseRow = convertKeysToCamelCase(rows[0]);
    res.status(200).json(camelCaseRow);
  } catch (error) {
    console.error('Error fetching job seeker details:', error);
    res.status(500).json({ message: 'Error fetching job seeker details', error: error.message });
  }
});

// Accept job seeker application
router.put('/jobgiver/jobseekers/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `UPDATE jobseeker SET status = 'accepted' WHERE id = ?`;
    await pool.execute(sql, [id]);
    res.status(200).json({ message: 'Application accepted' });
  } catch (error) {
    console.error('Error accepting job seeker:', error);
    res.status(500).json({ message: 'Error accepting application', error: error.message });
  }
});

// Decline job seeker application
router.put('/jobgiver/jobseekers/:id/decline', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `UPDATE jobseeker SET status = 'declined' WHERE id = ?`;
    await pool.execute(sql, [id]);
    res.status(200).json({ message: 'Application declined' });
  } catch (error) {
    console.error('Error declining job seeker:', error);
    res.status(500).json({ message: 'Error declining application', error: error.message });
  }
});

// Helper for normalizeImageUrl
const normalizeImg = (url, req) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http')) return trimmed;
  const host = req.get('host');
  const protocol = req.protocol;
  const basename = path.basename(trimmed);
  if (!basename) return null;
  return `${protocol}://${host}/uploads/jobgiver/${basename}`;
};

// GET all job givers for admin view
const handleGetAllJobGivers = async (req, res) => {
  try {
    const sql = `
      SELECT 
        jd.id,
        jd.name AS ownerName,
        jd.shop_name AS shopName,
        jd.shop_type AS shopType,
        jd.area,
        jd.city,
        jd.landmark,
        jd.contact,
        jd.created_at AS createdAt,
        jj.job_title AS jobTitle,
        jj.employment_type AS employmentType,
        jj.age,
        jj.gender,
        jj.education,
        jj.experience_year AS experienceYear,
        jj.experience_field AS experienceField,
        jj.working_time_start AS workingTimeStart,
        jj.working_time_end AS workingTimeEnd,
        jj.working_timings AS workingTimings,
        js.salary_offering AS salaryOffering,
        js.other_skills AS otherSkills,
        js.shop_photo1 AS shopPhoto1Raw,
        js.shop_photo2 AS shopPhoto2Raw,
        js.shop_photo3 AS shopPhoto3Raw
      FROM jobgiverdet jd
      LEFT JOIN jobgiverjob jj ON jd.id = jj.jobgiverdet_id
      LEFT JOIN jobgiversalary js ON jd.id = js.jobgiverdet_id
      ORDER BY jd.id DESC
    `;

    const [rows] = await pool.execute(sql);

    let filenames = [];
    try {
      filenames = fs.existsSync(jobGiverUploadsDir) ? fs.readdirSync(jobGiverUploadsDir) : [];
    } catch (_) {
      filenames = [];
    }

    const hostHeader = req.get('host');
    const protocol = req.protocol || 'http';
    const origin = hostHeader ? `${protocol}://${hostHeader}` : '';

    const results = rows.map(row => {
      const id = row.id;
      let images = [];

      const img1 = normalizeImg(row.shopPhoto1Raw, req);
      const img2 = normalizeImg(row.shopPhoto2Raw, req);
      const img3 = normalizeImg(row.shopPhoto3Raw, req);
      if (img1) images.push(img1);
      if (img2) images.push(img2);
      if (img3) images.push(img3);

      if (images.length === 0 && id != null && origin && filenames.length > 0) {
        const prefix = `jobgiver-${id}-`;
        images = filenames
          .filter(fn => typeof fn === 'string' && fn.startsWith(prefix))
          .map(fn => `${origin}/uploads/jobgiver/${fn}`);
      }

      const { shopPhoto1Raw, shopPhoto2Raw, shopPhoto3Raw, ...rest } = row;
      return {
        ...rest,
        images,
        shopPhoto1: images[0] || null,
        shopPhoto2: images[1] || null,
        shopPhoto3: images[2] || null
      };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching admin job givers:', error);
    res.status(500).json({ message: 'Error fetching job givers', error: error.message });
  }
};

router.get('/jobgiver/owners', handleGetAllJobGivers);
router.get('/admin/jobgiver/all', handleGetAllJobGivers);

export default router;
