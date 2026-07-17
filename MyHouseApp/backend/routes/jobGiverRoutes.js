import { Router } from 'express';
import { pool } from '../config/database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory for job giver if it doesn't exist
const jobGiverUploadsDir = path.join(__dirname, '../uploads', 'jobgiver');
if (!fs.existsSync(jobGiverUploadsDir)) {
  fs.mkdirSync(jobGiverUploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, jobGiverUploadsDir);
  },
  filename: (req, file, cb) => {
    const jobGiverId = req.body.jobGiverId || Date.now();
    const fieldName = file.fieldname;
    const ext = path.extname(file.originalname);
    const filename = `jobgiver-${jobGiverId}-${fieldName}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Save job giver step 1 (personal info)
router.post('/jobgiver/step1', async (req, res) => {
  try {
    console.log('Step 1 req.body:', req.body);
    const { name, shopName, shopType, area, city, landmark, contact } = req.body;

    // Convert undefined to null
    const values = [
      name,
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
    const { jobGiverId, jobTitle, employmentType, age, gender, education, experienceYear, experienceField, workingTimeStart, workingTimeEnd } = req.body;

    console.log('Inserting into jobgiverjob with values:', [jobGiverId, jobTitle, employmentType, age, gender, education, experienceYear, experienceField, workingTimeStart, workingTimeEnd]);
    const sql = `INSERT INTO jobgiverjob (jobgiverdet_id, job_title, employment_type, age, gender, education, experience_year, experience_field, working_time_start, working_time_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await pool.execute(sql, [jobGiverId, jobTitle, employmentType, age, gender, education, experienceYear, experienceField, workingTimeStart, workingTimeEnd]);

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

// Get all job seekers for job giver
router.get('/jobgiver/jobseekers', async (req, res) => {
  try {
    const sql = `SELECT js.*, jd.shop_name, jd.shop_type, jd.area, jd.city FROM jobseeker js LEFT JOIN jobgiverdet jd ON js.job_giver_job_id = jd.id ORDER BY js.created_at DESC`;
    const [rows] = await pool.execute(sql);
    
    // Convert snake_case to camelCase
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
    const sql = `SELECT js.*, jd.shop_name, jd.shop_type, jd.area, jd.city FROM jobseeker js LEFT JOIN jobgiverdet jd ON js.job_giver_job_id = jd.id WHERE js.id = ?`;
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

export default router;
