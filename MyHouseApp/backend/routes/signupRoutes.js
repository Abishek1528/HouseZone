import { Router } from 'express';
import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

const router = Router();

// API endpoint for user signup
router.post('/signup', async (req, res) => {
  try {
    const { name, age, contact, email, password } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT email FROM signup WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new user with correct column names from your table
    const [result] = await pool.execute(
      'INSERT INTO signup (name, age, contact_number, email, password) VALUES (?, ?, ?, ?, ?)',
      [name, age, contact, email, hashedPassword]
    );
    
    res.status(201).json({ id: result.insertId, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Error during signup');
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