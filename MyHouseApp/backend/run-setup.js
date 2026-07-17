
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const columnExists = async (connection, tableName, columnName) => {
  const [rows] = await connection.query(
    `SHOW COLUMNS FROM ${tableName} LIKE ?`,
    [columnName]
  );
  return rows.length > 0;
};

const runSetup = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'defaultdb'
    });

    console.log('Connected to database');

    const setupSqlPath = path.join(__dirname, 'setup.sql');
    let setupSql = await fs.readFile(setupSqlPath, 'utf8');

    // Remove the USE statement since we already specified database in connection
    setupSql = setupSql.replace(/USE .*?;/i, '');

    // Split into individual statements
    const statements = setupSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s);

    for (const statement of statements) {
      // Skip the ALTER TABLE statements that use IF NOT EXISTS, we'll handle those separately
      if (statement.includes('ADD COLUMN IF NOT EXISTS') || statement.includes('DROP COLUMN IF EXISTS')) {
        continue;
      }
      console.log('Executing:', statement.substring(0, 80) + '...');
      await connection.query(statement);
    }

    // Now handle the column additions manually
    console.log('\nChecking and adding missing columns...');

    // Check and add job_title to jobgiverjob
    if (!(await columnExists(connection, 'jobgiverjob', 'job_title'))) {
      console.log('Adding job_title column to jobgiverjob...');
      await connection.query(
        'ALTER TABLE jobgiverjob ADD COLUMN job_title VARCHAR(255) NOT NULL AFTER jobgiverdet_id'
      );
    } else {
      console.log('job_title column already exists in jobgiverjob');
    }

    // Check and add employment_type to jobgiverjob
    if (!(await columnExists(connection, 'jobgiverjob', 'employment_type'))) {
      console.log('Adding employment_type column to jobgiverjob...');
      await connection.query(
        "ALTER TABLE jobgiverjob ADD COLUMN employment_type VARCHAR(50) NOT NULL DEFAULT 'full-time' AFTER job_title"
      );
    } else {
      console.log('employment_type column already exists in jobgiverjob');
    }

    // Check and add add_experience to jobseeker
    if (!(await columnExists(connection, 'jobseeker', 'add_experience'))) {
      console.log('Adding add_experience column to jobseeker...');
      await connection.query(
        'ALTER TABLE jobseeker ADD COLUMN add_experience TEXT AFTER last_working_shop'
      );
    } else {
      console.log('add_experience column already exists in jobseeker');
    }

    // Check and drop other_skills from jobseeker if it exists
    if (await columnExists(connection, 'jobseeker', 'other_skills')) {
      console.log('Dropping other_skills column from jobseeker...');
      await connection.query(
        'ALTER TABLE jobseeker DROP COLUMN other_skills'
      );
    } else {
      console.log('other_skills column does not exist in jobseeker');
    }

    console.log('\nSetup completed successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error running setup:', error);
    process.exit(1);
  }
};

runSetup();
