-- Add add_experience column to jobseeker table
ALTER TABLE jobseeker ADD COLUMN add_experience TEXT AFTER last_working_shop;
