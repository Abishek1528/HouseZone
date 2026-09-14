USE defaultdb;

ALTER TABLE jobseeker ADD COLUMN street VARCHAR(255) NULL AFTER gender;

ALTER TABLE job_seeker_profiles ADD COLUMN street VARCHAR(255) NULL AFTER gender;
