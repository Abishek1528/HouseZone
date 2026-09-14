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

// Columns that Add My Profile form expects on job_seeker_profiles.
// Maps snake_case column name → full ALTER TABLE fragment.
const JOB_SEEKER_PROFILE_EXPECTED_COLUMNS = [
  {
    name: 'street',
    alter: 'ALTER TABLE job_seeker_profiles ADD COLUMN street VARCHAR(255) NULL AFTER gender'
  },
  {
    name: 'area',
    alter: 'ALTER TABLE job_seeker_profiles ADD COLUMN area VARCHAR(255) NULL AFTER street'
  },
  {
    name: 'city',
    alter: 'ALTER TABLE job_seeker_profiles ADD COLUMN city VARCHAR(255) NULL AFTER area'
  },
  {
    name: 'aadhar',
    alter: 'ALTER TABLE job_seeker_profiles ADD COLUMN aadhar VARCHAR(12) NULL AFTER city'
  },
  {
    name: 'phone_number',
    alter: 'ALTER TABLE job_seeker_profiles ADD COLUMN phone_number VARCHAR(15) NULL AFTER aadhar'
  },
  {
    name: 'can_join_immediately',
    alter: 'ALTER TABLE job_seeker_profiles ADD COLUMN can_join_immediately VARCHAR(5) NULL AFTER phone_number'
  },
];

let profileColumnsRepaired = false;
const repairJobSeekerProfileColumns = async () => {
  if (profileColumnsRepaired) return;
  let doneSomething = false;
  for (const col of JOB_SEEKER_PROFILE_EXPECTED_COLUMNS) {
    try {
      await pool.execute(col.alter);
      console.log(`[jobSeekerProfile][repair] Added missing column: ${col.name}`);
      doneSomething = true;
    } catch (err) {
      if (err?.code === 'ER_DUP_FIELDNAME') {
        // already present; do nothing
      } else {
        console.warn(`[jobSeekerProfile][repair] Could not ensure column ${col.name}:`, err.message);
      }
    }
  }
  profileColumnsRepaired = true;
  if (doneSomething) {
    console.log('[jobSeekerProfile][repair] Column repair finished.');
  }
};

const JOB_SEEKER_EXPECTED_COLUMNS = [
  {
    name: 'street',
    alter: 'ALTER TABLE jobseeker ADD COLUMN street VARCHAR(255) NULL AFTER gender'
  },
  {
    name: 'area',
    alter: 'ALTER TABLE jobseeker ADD COLUMN area VARCHAR(255) NULL AFTER street'
  },
  {
    name: 'city',
    alter: 'ALTER TABLE jobseeker ADD COLUMN city VARCHAR(255) NULL AFTER area'
  },
  {
    name: 'contact_no',
    alter: 'ALTER TABLE jobseeker ADD COLUMN contact_no VARCHAR(15) NULL AFTER city'
  },
];

let jobSeekerColumnsRepaired = false;
const repairJobSeekerColumns = async () => {
  if (jobSeekerColumnsRepaired) return;
  let doneSomething = false;
  for (const col of JOB_SEEKER_EXPECTED_COLUMNS) {
    try {
      await pool.execute(col.alter);
      console.log(`[jobseeker][repair] Added missing column: ${col.name}`);
      doneSomething = true;
    } catch (err) {
      if (err?.code === 'ER_DUP_FIELDNAME') {
        // already present
      } else {
        console.warn(`[jobseeker][repair] Could not ensure column ${col.name}:`, err.message);
      }
    }
  }
  jobSeekerColumnsRepaired = true;
  if (doneSomething) {
    console.log('[jobseeker][repair] Column repair finished.');
  }
};

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
      street,
      area,
      city,
      contactNo,
      aadharNumber,
      profilePicture,
      experience,
      education,
      experienceYears,
      lastWorkingShop,
      addExperience,
      canJoinImmediately,
      preferredEmploymentType,
      jobGiverJobId
    } = req.body;

    // Convert undefined to null
    const values = [
      fullName,
      mobileNumber,
      age,
      gender,
      street !== undefined ? street : null,
      area !== undefined ? area : null,
      city !== undefined ? city : null,
      contactNo !== undefined ? contactNo : null,
      aadharNumber !== undefined ? aadharNumber : null,
      profilePicture !== undefined ? profilePicture : null,
      experience,
      education,
      experienceYears !== undefined ? experienceYears : null,
      lastWorkingShop !== undefined ? lastWorkingShop : null,
      addExperience !== undefined ? addExperience : null,
      canJoinImmediately,
      preferredEmploymentType !== undefined ? preferredEmploymentType : null,
      jobGiverJobId !== undefined ? jobGiverJobId : null
    ];

    console.log('Inserting into jobseeker with values:', values);
    const insertSql = `INSERT INTO jobseeker (full_name, mobile_number, age, gender, street, area, city, contact_no, aadhar_number, profile_picture, experience, education, experience_years, last_working_shop, add_experience, can_join_immediately, preferred_employment_type, job_giver_job_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    let insertResult;
    try {
      [insertResult] = await pool.execute(insertSql, values);
    } catch (insertErr) {
      if (insertErr?.code === 'ER_BAD_FIELD_ERROR') {
        console.warn('[jobseeker] Missing columns detected. Running on-demand repair...');
        await repairJobSeekerColumns();
        console.log('[jobseeker] Retrying INSERT after repair...');
        [insertResult] = await pool.execute(insertSql, values);
      } else {
        throw insertErr;
      }
    }
    console.log('Insert result:', insertResult);

    res.status(201).json({ jobSeekerId: insertResult.insertId, message: 'Job seeker data saved successfully' });
  } catch (error) {
    console.error('Error saving job seeker data:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error saving job seeker data', error: error.message });
  }
});

// Get all job listings for job seeker
router.get('/jobseeker/jobs', async (req, res) => {
  try {
    let query = `SELECT 
      jd.id,
      jd.shop_name,
      jd.shop_type,
      jd.area,
      jd.city,
      jd.created_at,
      jj.job_title,
      jj.employment_type,
      jj.age,
      jj.gender,
      jj.education,
      jj.experience_year,
      jj.experience_field,
      jj.working_time_start,
      jj.working_time_end,
      js.salary_offering
    FROM jobgiverdet jd
    LEFT JOIN jobgiverjob jj ON jd.id = jj.jobgiverdet_id
    LEFT JOIN jobgiversalary js ON jd.id = js.jobgiverdet_id`;

    const params = [];
    const conditions = [];

    const { jobTitle, area, minSalary, maxSalary, employmentType } = req.query;

    if (jobTitle) {
      conditions.push(`jj.job_title LIKE ?`);
      params.push(`%${jobTitle}%`);
    }

    if (area) {
      conditions.push(`jd.area LIKE ?`);
      params.push(`%${area}%`);
    }

    if (minSalary) {
      conditions.push(`js.salary_offering >= ?`);
      params.push(parseFloat(minSalary));
    }

    if (maxSalary) {
      conditions.push(`js.salary_offering <= ?`);
      params.push(parseFloat(maxSalary));
    }

    if (employmentType) {
      conditions.push(`jj.employment_type = ?`);
      params.push(employmentType);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY jd.id DESC`;

    let rows = [];
    try {
      const [dbRows] = await pool.execute(query, params);
      if (Array.isArray(dbRows)) rows = dbRows;
    } catch (dbErr) {
      console.error('[jobseeker/jobs] Database query failed:', dbErr.message);
      console.error('[jobseeker/jobs] Query executed:', query);
      console.error('[jobseeker/jobs] Params:', params);
    }

    let filenames = [];
    try {
      filenames = fs.existsSync(jobGiverUploadsDir) ? fs.readdirSync(jobGiverUploadsDir) : [];
    } catch (_) {
      filenames = [];
    }

    const hostHeader = req.get('host');
    const protocol = req.protocol || 'http';
    const origin = hostHeader ? `${protocol}://${hostHeader}` : '';

    const withImages = rows
      .filter(row => row && typeof row === 'object')
      .map(row => {
        const id = row.id;
        let firstImage = null;
        if (id != null && origin) {
          const prefix = `jobgiver-${id}-`;
          const urls = filenames
            .filter(fn => typeof fn === 'string' && fn.startsWith(prefix))
            .map(fn => `${origin}/uploads/jobgiver/${fn}`);
          firstImage = urls.find(url => url.includes('shopPhoto1')) || urls[0] || null;
        }
        try {
          const camelCaseRow = convertKeysToCamelCase(row);
          return { ...camelCaseRow, shopPhoto1: firstImage };
        } catch (mapErr) {
          console.error('[jobseeker/jobs] Row transform failed for id=', id, mapErr.message);
          return null;
        }
      })
      .filter(item => item !== null && item !== undefined);

    res.status(200).json(withImages);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    console.error('Error stack:', error.stack);
    // Always return a valid empty array + 200 on catastrophic failure so the UI
    // does not break. The UI can display a "no companies" message + retry hint.
    res.status(200).json([]);
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
        jd.created_at,
        jj.job_title,
        jj.employment_type,
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

// GET job seeker applications by mobile number
router.get('/jobseeker/applications/:mobileNumber', async (req, res) => {
  try {
    const { mobileNumber } = req.params;

    const [rows] = await pool.execute(
      `SELECT js.*, jd.shop_name, jd.shop_type, jd.area, jd.city, jsal.salary_offering, jj.working_time_start, jj.working_time_end 
       FROM jobseeker js 
       LEFT JOIN jobgiverdet jd ON js.job_giver_job_id = jd.id 
       LEFT JOIN jobgiverjob jj ON jd.id = jj.jobgiverdet_id
       LEFT JOIN jobgiversalary jsal ON jd.id = jsal.jobgiverdet_id 
       WHERE js.mobile_number = ? 
       ORDER BY js.created_at DESC`,
      [mobileNumber]
    );

    // Convert snake_case to camelCase
    const camelCaseRows = rows.map(convertKeysToCamelCase);
    res.status(200).json(camelCaseRows);
  } catch (error) {
    console.error('Error fetching job seeker applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// POST save job seeker profile (Add My Profile form) — ALWAYS inserts a new row.
// The button is "Add My Profile" so each click creates a brand new card in the list.
// No upsert / no matching — every save becomes a 4th, 5th, 6th… new card.
//
// Self-healing: if INSERT fails with ER_BAD_FIELD_ERROR because of missing columns
// (e.g. migration hasn't been applied yet), we automatically run the ALTER TABLEs
// and retry the INSERT ONCE. This means a backend restart is NOT required to fix
// the "Unknown column 'area' in 'field list'" error — saving a profile repairs
// the database on demand.
router.post('/jobseeker/profile', async (req, res) => {
  try {
    console.log('[jobSeekerProfile] req.body:', req.body);
    const {
      signupId,
      name,
      age,
      gender,
      education,
      experienceStatus,
      experienceYears,
      experienceField,
      street,
      area,
      city,
      aadhar,
      phoneNumber,
      canJoinImmediately
    } = req.body;

    // Basic validation
    if (!name || !age || !gender || !education || !experienceStatus) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }
    if (experienceStatus === 'experienced') {
      if (!experienceYears || !experienceField) {
        return res.status(400).json({ message: 'Experience years and field are required for experienced.' });
      }
    }

    const insertSql = `
      INSERT INTO job_seeker_profiles (
        signup_id, name, age, gender, education, experience_status, experience_years, experience_field,
        street, area, city, aadhar, phone_number, can_join_immediately
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertValues = [
      signupId !== undefined ? signupId : null,
      name,
      age,
      gender,
      education,
      experienceStatus,
      experienceStatus === 'experienced' ? (experienceYears || null) : null,
      experienceStatus === 'experienced' ? (experienceField || null) : null,
      street !== undefined ? street : null,
      area !== undefined ? area : null,
      city !== undefined ? city : null,
      aadhar !== undefined ? aadhar : null,
      phoneNumber !== undefined ? phoneNumber : null,
      canJoinImmediately !== undefined ? canJoinImmediately : null
    ];

    let insertResult;
    try {
      [insertResult] = await pool.execute(insertSql, insertValues);
    } catch (insertErr) {
      if (insertErr?.code === 'ER_BAD_FIELD_ERROR') {
        console.warn('[jobSeekerProfile] Missing columns detected. Running on-demand repair...');
        await repairJobSeekerProfileColumns();
        console.log('[jobSeekerProfile] Retrying INSERT after repair...');
        [insertResult] = await pool.execute(insertSql, insertValues);
      } else {
        throw insertErr;
      }
    }

    const profileId = insertResult.insertId;
    res.status(201).json({ profileId, message: 'Profile saved successfully' });
  } catch (error) {
    console.error('[jobSeekerProfile] Error saving profile:', error);
    console.error('[jobSeekerProfile] Error stack:', error.stack);
    res.status(500).json({ message: 'Error saving profile', error: error.message });
  }
});

// GET job seeker profile (by signupId only)
router.get('/jobseeker/profile', async (req, res) => {
  try {
    const { signupId } = req.query;
    let row = null;

    if (signupId) {
      const [rows] = await pool.execute(
        'SELECT * FROM job_seeker_profiles WHERE signup_id = ? LIMIT 1',
        [signupId]
      );
      row = rows[0];
    }

    if (!row) {
      return res.status(200).json(null);
    }

    const profile = convertKeysToCamelCase(row);
    res.status(200).json(profile);
  } catch (error) {
    console.error('[jobSeekerProfile] Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// GET all job seeker profiles (browse)
router.get('/jobseeker/profiles/all', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM job_seeker_profiles ORDER BY created_at DESC'
    );
    const profiles = convertKeysToCamelCase(rows);
    res.status(200).json(profiles);
  } catch (error) {
    console.error('[jobSeekerProfile] Error fetching all profiles:', error);
    res.status(500).json({ message: 'Error fetching profiles', error: error.message });
  }
});

// GET job seeker profile by ID
router.get('/jobseeker/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM job_seeker_profiles WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    const profile = convertKeysToCamelCase(rows[0]);
    res.status(200).json(profile);
  } catch (error) {
    console.error('[jobSeekerProfile] Error fetching profile by id:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

export default router;
