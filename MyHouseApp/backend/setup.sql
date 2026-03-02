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


-- CREATE TABLE vehiclesowndet (
--     id INT AUTO_INCREMENT PRIMARY KEY,

--     name_of_person VARCHAR(255) NOT NULL,
--     door_no VARCHAR(50) NOT NULL,
--     street VARCHAR(255) NOT NULL,
--     pincode VARCHAR(10) NOT NULL,
--     area VARCHAR(255) NOT NULL,
--     city VARCHAR(100) NOT NULL,
--     contact_no VARCHAR(20) NOT NULL,

--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- CREATE TABLE vehiclesdet (
--     id INT AUTO_INCREMENT PRIMARY KEY,

--     vehiclesowndet_id INT NOT NULL,

--     -- Vehicle basic details
--     vehicle_type VARCHAR(50) NOT NULL,
--     vehicle_name VARCHAR(100) NOT NULL,
--     vehicle_model VARCHAR(100) NOT NULL,
--     seat_capacity INT NOT NULL,
--     fuel_type VARCHAR(50) NOT NULL,

--     -- AC pricing
--     ac_charge_per_day DECIMAL(10,2),
--     ac_charge_per_km DECIMAL(10,2),
--     ac_waiting_charge_per_hour DECIMAL(10,2),
--     ac_waiting_charge_per_night DECIMAL(10,2),
--     ac_fixed BOOLEAN DEFAULT FALSE,

--     -- Non-AC pricing
--     nonac_charge_per_day DECIMAL(10,2),
--     nonac_charge_per_km DECIMAL(10,2),
--     nonac_waiting_charge_per_hour DECIMAL(10,2),
--     nonac_waiting_charge_per_night DECIMAL(10,2),
--     nonac_fixed BOOLEAN DEFAULT FALSE,

--     -- Vehicle images (4–7 images)
--     vehicle_images JSON NOT NULL,

--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT fk_vehicles_owner
--         FOREIGN KEY (vehiclesowndet_id)
--         REFERENCES vehiclesowndet(id)
--         ON DELETE CASCADE
--         ON UPDATE CASCADE
-- );