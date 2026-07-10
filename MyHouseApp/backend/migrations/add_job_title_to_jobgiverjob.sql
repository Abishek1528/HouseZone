-- Add job_title column to jobgiverjob table
ALTER TABLE jobgiverjob ADD COLUMN job_title VARCHAR(255) NOT NULL AFTER jobgiverdet_id;
