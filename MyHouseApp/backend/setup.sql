-- Use the existing database
USE cdmrental;

-- CREATE TABLE commands for all tables needed in the application:

-- 1. signup table 
-- CREATE TABLE signup (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     age INT NOT NULL,
--     contact VARCHAR(20) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- 2. resowndet table 
-- CREATE TABLE resowndet (
--     roNo INT AUTO_INCREMENT PRIMARY KEY,
--     roName VARCHAR(255) NOT NULL,
--     roDoor INT NOT NULL,
--     roStreet VARCHAR(255) NOT NULL,
--     roArea VARCHAR(255) NOT NULL,
--     roPin INT NOT NULL,
--     roCity VARCHAR(100) NOT NULL,
--     roPhNo BIGINT NOT NULL
-- );

-- 3. resownho table 
-- CREATE TABLE resownho (
--     roNo INT PRIMARY KEY,
--     facing_direction VARCHAR(50),
--     hall_length DECIMAL(10,2),
--     hall_breadth DECIMAL(10,2),
--     number_of_bedrooms INT,
--     kitchen_length DECIMAL(10,2),
--     kitchen_breadth DECIMAL(10,2),
--     number_of_bathrooms INT,
--     bathroom1_type VARCHAR(50),
--     bathroom2_type VARCHAR(50),
--     bathroom3_type VARCHAR(50),
--     bathroom1_access VARCHAR(50),
--     bathroom2_access VARCHAR(50),
--     bathroom3_access VARCHAR(50),
--     floor_number INT,
--     parking_2wheeler BOOLEAN,
--     parking_4wheeler BOOLEAN,
--     FOREIGN KEY (roNo) REFERENCES resowndet(roNo)
-- );

-- 4. bedroom_sizes table 
-- CREATE TABLE bedroom_sizes (
--     roNo INT,
--     bedroom_number INT,
--     length DECIMAL(10,2),
--     breadth DECIMAL(10,2),
--     FOREIGN KEY (roNo) REFERENCES resowndet(roNo)
-- );

-- 5. resownpay table
-- CREATE TABLE resownpay (
--     roNo INT PRIMARY KEY,
--     advance_amount DECIMAL(10,2),
--     monthly_rent DECIMAL(10,2),
--     lease_amount DECIMAL(10,2),
--     FOREIGN KEY (roNo) REFERENCES resowndet(roNo)
-- );

-- 6. location table 
-- CREATE TABLE location (
--     roNo INT,
--     street_breadth VARCHAR(20),
--     bus_stop VARCHAR(20),
--     bus_stop_distance INT,
--     school VARCHAR(20),
--     school_distance INT,
--     shopping_mall VARCHAR(20),
--     shopping_mall_distance INT,
--     bank VARCHAR(20),
--     bank_distance INT,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (roNo) REFERENCES resowndet(roNo)
-- );

-- 7. conditions table 
-- CREATE TABLE conditions (
--     roNo INT,
--     condition_numbers TEXT, 
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (roNo) REFERENCES resowndet(roNo)
-- );

