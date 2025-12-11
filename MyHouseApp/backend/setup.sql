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
--             kitchen_length, kitchen_breadth, number_of_bathrooms, bathroom1_type, floor_number
--
-- 3. bedroom_sizes - For residential owner step 2 bedroom details
--    Columns: roNo, bedroom_number, length, breadth