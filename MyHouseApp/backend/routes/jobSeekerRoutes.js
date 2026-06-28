import { Router } from 'express';
import { pool } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const jobGiverUploadsDir = path.join(__dirname, '../uploads', 'jobgiver');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(jobGiverUploadsDir)) {
  fs.mkdirSync(jobGiverUploadsDir, { recursive: true });
}

// Helper function to convert snake_case to camelCase
const toCamelCase = (str) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

// Helper function to convert object keys from snake_case to camelCase
const convertKeysToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toCamelCase(key)] = obj[key];
      return result;
    }, {});
  }
  return obj;
};

// POST save job seeker form data
router.post('/jobseeker', async (req, res) => {
  try {
    console.log('Job seeker req.body:', req.body);
    const {
      fullName,
      mobileNumber,
      age,
      gender,
      aadharNumber,
      profilePicture,
      experience,
      education,
      experienceYears,
      lastWorkingShop,
      otherSkills,
      canJoinImmediately
    } = req.body;

    // Convert undefined to null
    const values = [
      fullName,
      mobileNumber,
      age,
      gender,
      aadharNumber !== undefined ? aadharNumber : null,
      profilePicture !== undefined ? profilePicture : null,
      experience,
      education,
      experienceYears !== undefined ? experienceYears : null,
      lastWorkingShop !== undefined ? lastWorkingShop : null,
      otherSkills !== undefined ? otherSkills : null,
      canJoinImmediately
    ];

    console.log('Inserting into jobseeker with values:', values);
    const sql = `INSERT INTO jobseeker (full_name, mobile_number, age, gender, aadhar_number, profile_picture, experience, education, experience_years, last_working_shop, other_skills, can_join_immediately) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, values);
    console.log('Insert result:', result);

    res.status(201).json({ jobSeekerId: result.insertId, message: 'Job seeker data saved successfully' });
  } catch (error) {
    console.error('Error saving job seeker data:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error saving job seeker data', error: error.message });
  }
});

// GET all job listings for job seeker
router.get('/jobseeker/jobs', async (req, res) => {
  try {
    let query = `SELECT 
      jd.id,
      jd.shop_name,
      jd.shop_type,
      jd.area,
      jd.city,
      jj.age,
      jj.gender,
      jj.education,
      jj.experience_year,
      jj.experience_field,
      js.salary_offering
    FROM jobgiverdet jd
    LEFT JOIN jobgiverjob jj ON jd.id = jj.jobgiverdet_id
    LEFT JOIN jobgiversalary js ON jd.id = js.jobgiverdet_id`;

    query += ` ORDER BY jd.id DESC`;

    const [rows] = await pool.execute(query);

    let filenames = [];
    try {
      filenames = fs.readdirSync(jobGiverUploadsDir);
    } catch (_) {
      filenames = [];
    }
    const origin = `${req.protocol}://${req.get('host')}`;
    const withImages = rows.map(row => {
      const id = row.id;
      const prefix = `jobgiver-${id}-`;
      const urls = filenames
        .filter(fn => fn.startsWith(prefix))
        .map(fn => `${origin}/uploads/jobgiver/${fn}`);
      const firstImage = urls.find(url => url.includes('shopPhoto1')) || urls[0] || null;
      const camelCaseRow = convertKeysToCamelCase(row);
      return { ...camelCaseRow, shopPhoto1: firstImage };
    });

    res.status(200).json(withImages);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ message: 'Error fetching job listings', error: error.message });
  }
});

// GET detailed job information
router.get('/jobseeker/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT 
        jd.id,
        jd.name,
        jd.shop_name,
        jd.shop_type,
        jd.area,
        jd.city,
        jd.landmark,
        jd.contact,
        jj.age,
        jj.gender,
        jj.education,
        jj.experience_year,
        jj.experience_field,
        jj.working_time_start,
        jj.working_time_end,
        js.salary_offering,
        js.other_skills,
        js.shop_photo1,
        js.shop_photo2,
        js.shop_photo3
      FROM jobgiverdet jd
      LEFT JOIN jobgiverjob jj ON jd.id = jj.jobgiverdet_id
      LEFT JOIN jobgiversalary js ON jd.id = js.jobgiverdet_id
      WHERE jd.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Job not found' });

    const job = rows[0];

    let filenames = [];
    try {
      filenames = fs.readdirSync(jobGiverUploadsDir);
    } catch (_) {
      filenames = [];
    }
    const origin = `${req.protocol}://${req.get('host')}`;
    const prefix = `jobgiver-${id}-`;
    const images = filenames
      .filter(fn => fn.startsWith(prefix))
      .map(fn => `${origin}/uploads/jobgiver/${fn}`);

    const camelCaseJob = convertKeysToCamelCase(job);
    const structuredData = {
      ...camelCaseJob,
      shopPhoto1: images.find(url => url.includes('shopPhoto1')) || null,
      shopPhoto2: images.find(url => url.includes('shopPhoto2')) || null,
      shopPhoto3: images.find(url => url.includes('shopPhoto3')) || null,
      images: images
    };

    res.status(200).json(structuredData);
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ message: 'Error fetching job details', error: error.message });
  }
});

export default router;
