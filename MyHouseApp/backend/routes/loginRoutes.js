import { Router } from 'express';
import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

const router = Router();

// API endpoint for user login
router.post('/login', async (req, res) => {
  try {
    const { name, contact, password } = req.body;
    
    // Check if user exists with provided name and contact
    const [users] = await pool.execute(
      'SELECT id, name, contact_number, email, password FROM signup WHERE name = ? AND contact_number = ?',
      [name, contact]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Store login information
    try {
      await pool.execute(
        'INSERT INTO signup_log (user_id, login_time) VALUES (?, NOW())',
        [user.id]
      );
    } catch (logError) {
      console.warn('Could not log login event:', logError.message);
      // Continue even if logging fails
    }
    
    // Return user data (excluding password) and success message
    const { password: _, ...userData } = user;
    res.status(200).json({ 
      message: 'Login successful', 
      user: userData 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

export default router;