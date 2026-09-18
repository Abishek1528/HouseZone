import { Router } from 'express';
import { pool } from '../config/database.js';

const router = Router();

const DEFAULT_JOB_TITLES = [
  'Manager',
  'Cashier',
  'Salesperson',
  'Accountant',
  'Supervisor',
  'Helper'
];

const DEFAULT_JOB_AREAS = [
  'Vandigate',
  'Ammapettai',
  'Omakulam',
  'Anamalai Nagar',
  'Chidambaram Town'
];

let tablesInitialized = false;

// Ensure tables exist and seed defaults
const ensureTables = async () => {
  if (tablesInitialized) return;
  try {
    // 1. job_titles
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS job_titles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const title of DEFAULT_JOB_TITLES) {
      try {
        await pool.execute('INSERT IGNORE INTO job_titles (title) VALUES (?)', [title]);
      } catch (_) {}
    }

    // 2. job_areas
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS job_areas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const area of DEFAULT_JOB_AREAS) {
      try {
        await pool.execute('INSERT IGNORE INTO job_areas (name) VALUES (?)', [area]);
      } catch (_) {}
    }

    tablesInitialized = true;
  } catch (error) {
    console.error('Error initializing job options tables:', error);
  }
};

// GET all job titles
router.get('/job-options/titles', async (req, res) => {
  try {
    await ensureTables();
    const [rows] = await pool.execute('SELECT * FROM job_titles ORDER BY id ASC');
    // If rows are empty, fallback to default titles
    if (!rows || rows.length === 0) {
      return res.status(200).json(DEFAULT_JOB_TITLES.map((t, idx) => ({ id: idx + 1, title: t })));
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching job titles:', error);
    res.status(200).json(DEFAULT_JOB_TITLES.map((t, idx) => ({ id: idx + 1, title: t })));
  }
});

// POST add new job title
router.post('/job-options/titles', async (req, res) => {
  try {
    await ensureTables();
    const { title } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: 'Job title is required' });
    }

    const trimmedTitle = String(title).trim();

    // Check if already exists
    const [existing] = await pool.execute('SELECT * FROM job_titles WHERE LOWER(title) = LOWER(?)', [trimmedTitle]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Job title already exists', item: existing[0] });
    }

    const [result] = await pool.execute('INSERT INTO job_titles (title) VALUES (?)', [trimmedTitle]);
    res.status(201).json({
      id: result.insertId,
      title: trimmedTitle,
      message: 'Job title added successfully'
    });
  } catch (error) {
    console.error('Error adding job title:', error);
    res.status(500).json({ message: 'Failed to add job title', error: error.message });
  }
});

// DELETE job title
router.delete('/job-options/titles/:id', async (req, res) => {
  try {
    await ensureTables();
    const { id } = req.params;
    await pool.execute('DELETE FROM job_titles WHERE id = ?', [id]);
    res.status(200).json({ message: 'Job title deleted successfully' });
  } catch (error) {
    console.error('Error deleting job title:', error);
    res.status(500).json({ message: 'Failed to delete job title', error: error.message });
  }
});

// GET all job areas
router.get('/job-options/areas', async (req, res) => {
  try {
    await ensureTables();
    const [rows] = await pool.execute('SELECT * FROM job_areas ORDER BY id ASC');
    if (!rows || rows.length === 0) {
      return res.status(200).json(DEFAULT_JOB_AREAS.map((a, idx) => ({ id: idx + 1, name: a })));
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching job areas:', error);
    res.status(200).json(DEFAULT_JOB_AREAS.map((a, idx) => ({ id: idx + 1, name: a })));
  }
});

// POST add new job area
router.post('/job-options/areas', async (req, res) => {
  try {
    await ensureTables();
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Area name is required' });
    }

    const trimmedName = String(name).trim();

    // Check if already exists
    const [existing] = await pool.execute('SELECT * FROM job_areas WHERE LOWER(name) = LOWER(?)', [trimmedName]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Area already exists', item: existing[0] });
    }

    const [result] = await pool.execute('INSERT INTO job_areas (name) VALUES (?)', [trimmedName]);
    res.status(201).json({
      id: result.insertId,
      name: trimmedName,
      message: 'Area added successfully'
    });
  } catch (error) {
    console.error('Error adding job area:', error);
    res.status(500).json({ message: 'Failed to add job area', error: error.message });
  }
});

// DELETE job area
router.delete('/job-options/areas/:id', async (req, res) => {
  try {
    await ensureTables();
    const { id } = req.params;
    await pool.execute('DELETE FROM job_areas WHERE id = ?', [id]);
    res.status(200).json({ message: 'Area deleted successfully' });
  } catch (error) {
    console.error('Error deleting job area:', error);
    res.status(500).json({ message: 'Failed to delete area', error: error.message });
  }
});

export default router;
