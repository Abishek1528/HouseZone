import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSetup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 3306,
    multipleStatements: true
  });

  try {
    console.log('Connected to MySQL server successfully');

    const sql = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');
    console.log('Executing setup.sql...');
    
    await connection.query(sql);
    
    console.log('✅ All tables created successfully in defaultdb');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await connection.end();
    console.log('Connection closed');
  }
}

runSetup();
