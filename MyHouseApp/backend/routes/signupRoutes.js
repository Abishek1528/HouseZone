import { Router } from 'express';
import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

const router = Router();

// Columns that signup table expects
const SIGNUP_EXPECTED_COLUMNS = [
  {
    name: 'age',
    alter: 'ALTER TABLE signup ADD COLUMN age INT NULL AFTER name'
  },
  {
    name: 'contact_number',
    alter: 'ALTER TABLE signup ADD COLUMN contact_number VARCHAR(15) NULL AFTER age'
  },
  {
    name: 'created_at',
    alter: 'ALTER TABLE signup ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_VALUE AFTER password'
  }
];

// Special case for created_at DEFAULT CURRENT_TIMESTAMP which might fail if using CURRENT_VALUE
const SIGNUP_CREATED_AT_FIX = 'ALTER TABLE signup MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP';

let signupColumnsRepaired = false;
const repairSignupColumns = async () => {
  if (signupColumnsRepaired) return;
  for (const col of SIGNUP_EXPECTED_COLUMNS) {
    try {
      await pool.execute(col.alter);
      console.log(`[signup][repair] Added missing column: ${col.name}`);
    } catch (err) {
      if (err?.code !== 'ER_DUP_FIELDNAME') {
        console.warn(`[signup][repair] Could not ensure column ${col.name}:`, err.message);
      }
    }
  }
  try {
    await pool.execute(SIGNUP_CREATED_AT_FIX);
  } catch (_) {}
  signupColumnsRepaired = true;
};

// API endpoint for user signup
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { name, age, contact, email, password } = req.body;
    
    // Check if user already exists
    console.log('Checking existing user with email:', email);
    const [existingUsers] = await pool.execute(
      'SELECT email FROM signup WHERE email = ? OR contact_number = ?',
      [email, contact]
    );
    
    if (existingUsers.length > 0) {
      console.log('User already exists with email or contact:', email, contact);
      return res.status(400).json({ message: 'User already exists with this email or contact number' });
    }
    
    // Hash the password
    console.log('Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new user
    const insertSql = 'INSERT INTO signup (name, age, contact_number, email, password) VALUES (?, ?, ?, ?, ?)';
    const values = [name, age, contact, email, hashedPassword];
    
    let result;
    try {
      [result] = await pool.execute(insertSql, values);
    } catch (insertErr) {
      if (insertErr?.code === 'ER_BAD_FIELD_ERROR') {
        console.warn('[signup] Missing columns detected. Repairing...');
        await repairSignupColumns();
        [result] = await pool.execute(insertSql, values);
      } else {
        throw insertErr;
      }
    }
    
    res.status(201).json({ id: result.insertId, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error during signup', error: error.message });
  }
});

// API endpoint to get today's signups
router.get('/signups/today', async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Query to get signups from today
    const [rows] = await pool.execute(
      `SELECT id, name, age, contact_number, email, created_at 
       FROM signup 
       WHERE DATE(created_at) = ?
       ORDER BY created_at DESC`,
      [dateString]
    );
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching today\'s signups:', error);
    res.status(500).json({ message: 'Error fetching signups', error: error.message });
  }
});

export default router;