ALTER TABLE jobgiverjob ADD COLUMN employment_type VARCHAR(50) NOT NULL DEFAULT 'full-time' AFTER job_title;
