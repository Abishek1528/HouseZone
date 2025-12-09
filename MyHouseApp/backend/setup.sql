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

-- Note: The resowndet table already exists with the following structure:
-- Table: resowndet
-- Columns: roNo, roName, roDoor, roStreet, roArea, roPin, roCity, roPhNo
-- This table is already being used by the application for residential owner details