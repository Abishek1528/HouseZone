import { pool } from '../config/database.js';

const addStatusColumn = async () => {
  try {
    console.log('Checking for status column in jobseeker table...');
    
    // Check if column exists
    const [columns] = await pool.execute(
      "SHOW COLUMNS FROM jobseeker LIKE 'status'"
    );
    
    if (columns.length === 0) {
      console.log('Status column not found. Adding now...');
      await pool.execute(
        "ALTER TABLE jobseeker ADD COLUMN status VARCHAR(50) DEFAULT 'pending'"
      );
      console.log('✅ Status column added successfully!');
    } else {
      console.log('✅ Status column already exists!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding status column:', error);
    process.exit(1);
  }
};

addStatusColumn();
