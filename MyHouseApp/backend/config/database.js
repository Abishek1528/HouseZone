import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cdmrental',
  port: parseInt(process.env.DB_PORT) || 3306,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the database connection
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export { pool, checkConnection };