import { pool } from '../config/database.js';

const addJobLink = async () => {
  try {
    console.log('Checking for job_giver_job_id column in jobseeker table...');
    
    // Check if column exists
    const [columns] = await pool.execute(
      "SHOW COLUMNS FROM jobseeker LIKE 'job_giver_job_id'"
    );
    
    if (columns.length === 0) {
      console.log('job_giver_job_id column not found. Adding now...');
      await pool.execute(
        "ALTER TABLE jobseeker ADD COLUMN job_giver_job_id INT, ADD FOREIGN KEY (job_giver_job_id) REFERENCES jobgiverdet(id) ON DELETE CASCADE"
      );
      console.log('✅ job_giver_job_id column added successfully!');
    } else {
      console.log('✅ job_giver_job_id column already exists!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding job_giver_job_id column:', error);
    process.exit(1);
  }
};

addJobLink();
