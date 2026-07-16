import { Router } from 'express';
import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

const router = Router();

// API endpoint for user login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { name, contact, password } = req.body;
    
    // Check if user exists with provided name and contact
    console.log('Checking user with name:', name, 'and contact:', contact);
    const [users] = await pool.execute(
      'SELECT id, name, contact_number, email, password FROM signup WHERE name = ? AND contact_number = ?',
      [name, contact]
    );
    
    console.log('Found users:', users.length);
    
    if (users.length === 0) {
      console.log('No user found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    console.log('User found:', user.name, user.contact_number);
    
    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Password invalid');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Store login information
    try {
      await pool.execute(
        'INSERT INTO signup_log (user_id, login_time) VALUES (?, NOW())',
        [user.id]
      );
      console.log('Login logged for user:', user.id);
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
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

export default router;