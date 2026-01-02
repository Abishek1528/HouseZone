-- Use the existing database
USE cdmrental;

-- Assuming your signup table already exists with the correct structure
-- If you need to recreate it, here's a sample structure based on the form fields:
-- CREATE TABLE signup (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     age INT NOT NULL,
--     contact VARCHAR(20) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Note: The following tables already exist and are being used by the application:
-- 1. resowndet - For residential owner step 1 details (Address Information)
--    Columns: roNo, roName, roDoor, roStreet, roArea, roPin, roCity, roPhNo
--
-- 2. resownho - For residential owner step 2 common details
--    Columns: roNo, facing_direction, hall_length, hall_breadth, number_of_bedrooms, 
--             kitchen_length, kitchen_breadth, number_of_bathrooms, bathroom1_type, bathroom2_type, bathroom3_type, floor_number,
--             parking_2wheeler, parking_4wheeler
--
-- 3. bedroom_sizes - For residential owner step 2 bedroom details
--    Columns: roNo, bedroom_number, length, breadth
--
-- 4. resownpay - For residential owner step 3 payment details
--    Columns: roNo, advance_amount, monthly_rent, lease_amount
--
-- 5. tenant_details - For tenant information
--    Columns: id, tenant_name, job, salary, native_place, current_address, mobile_number, alternate_number, property_id, created_at
-- 
-- 6. residential_amenities - For admin updated location & amenities information
--    Columns: id, roNo, street_size_breadth, nearby_bus_stop, bus_stop_distance, nearby_school, school_distance, nearby_shopping_mall, shopping_mall_distance, nearby_bank, bank_distance, updated_at

-- Add bathroom access columns to resownho table if they don't exist
ALTER TABLE resownho ADD COLUMN IF NOT EXISTS bathroom1_access VARCHAR(50) DEFAULT NULL;
ALTER TABLE resownho ADD COLUMN IF NOT EXISTS bathroom2_access VARCHAR(50) DEFAULT NULL;
ALTER TABLE resownho ADD COLUMN IF NOT EXISTS bathroom3_access VARCHAR(50) DEFAULT NULL;

-- Update any existing bathroom2_type and bathroom3_type columns if they don't exist
ALTER TABLE resownho ADD COLUMN IF NOT EXISTS bathroom2_type VARCHAR(50) DEFAULT NULL;
ALTER TABLE resownho ADD COLUMN IF NOT EXISTS bathroom3_type VARCHAR(50) DEFAULT NULL;

-- -- Create tenant_details table if it doesn't exist
-- CREATE TABLE IF NOT EXISTS tenant_details (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   tenant_name VARCHAR(255) NOT NULL,
--   job VARCHAR(255) NOT NULL,
--   salary DECIMAL(10,2) NOT NULL,
--   native_place VARCHAR(255) NOT NULL,
--   current_address TEXT,
--   mobile_number VARCHAR(20) NOT NULL,
--   alternate_number VARCHAR(20),
--   property_id INT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (property_id) REFERENCES resowndet(roNo)
-- );

-- Create location table if it doesn't exist
CREATE TABLE IF NOT EXISTS location (
  roNo INT,
  street_breadth VARCHAR(20),
  bus_stop VARCHAR(20),
  bus_stop_distance INT,
  school VARCHAR(20),
  school_distance INT,
  shopping_mall VARCHAR(20),
  shopping_mall_distance INT,
  bank VARCHAR(20),
  bank_distance INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (roNo) REFERENCES resowndet(roNo)
);

-- Create conditions table if it doesn't exist
CREATE TABLE IF NOT EXISTS conditions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roNo INT,
  condition_numbers TEXT, -- JSON array of selected condition numbers
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (roNo) REFERENCES resowndet(roNo)
);

-- Create residential_amenities table if it doesn't exist
