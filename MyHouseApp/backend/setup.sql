-- Use the defaultdb database
USE defaultdb;

-- 1. signup table (for user authentication)
CREATE TABLE IF NOT EXISTS signup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. signup_log table (for logging login events)
CREATE TABLE IF NOT EXISTS signup_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES signup(id) ON DELETE CASCADE
);

-- 3. resowndet table (residential owner details)
CREATE TABLE IF NOT EXISTS resowndet (
    roNo INT AUTO_INCREMENT PRIMARY KEY,
    roName VARCHAR(255) NOT NULL,
    roDoor INT NOT NULL,
    roStreet VARCHAR(255) NOT NULL,
    roArea VARCHAR(255) NOT NULL,
    roPin INT NOT NULL,
    roCity VARCHAR(100) NOT NULL,
    roPhNo BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. resownho table (residential house details)
CREATE TABLE IF NOT EXISTS resownho (
    roNo INT PRIMARY KEY,
    facing_direction VARCHAR(50),
    hall_length DECIMAL(10,2),
    hall_breadth DECIMAL(10,2),
    number_of_bedrooms INT,
    kitchen_length DECIMAL(10,2),
    kitchen_breadth DECIMAL(10,2),
    number_of_bathrooms INT,
    bathroom1_type VARCHAR(50),
    bathroom2_type VARCHAR(50),
    bathroom3_type VARCHAR(50),
    bathroom1_access VARCHAR(50),
    bathroom2_access VARCHAR(50),
    bathroom3_access VARCHAR(50),
    floor_number INT,
    parking_2wheeler BOOLEAN DEFAULT FALSE,
    parking_4wheeler BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (roNo) REFERENCES resowndet(roNo) ON DELETE CASCADE
);

-- 5. bedroom_sizes table
CREATE TABLE IF NOT EXISTS bedroom_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roNo INT NOT NULL,
    bedroom_number INT NOT NULL,
    length DECIMAL(10,2),
    breadth DECIMAL(10,2),
    FOREIGN KEY (roNo) REFERENCES resowndet(roNo) ON DELETE CASCADE
);

-- 6. resownpay table
CREATE TABLE IF NOT EXISTS resownpay (
    roNo INT PRIMARY KEY,
    advance_amount DECIMAL(10,2),
    monthly_rent DECIMAL(10,2),
    lease_amount DECIMAL(10,2),
    FOREIGN KEY (roNo) REFERENCES resowndet(roNo) ON DELETE CASCADE
);

-- 7. location table
CREATE TABLE IF NOT EXISTS location (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roNo INT NOT NULL,
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
    FOREIGN KEY (roNo) REFERENCES resowndet(roNo) ON DELETE CASCADE
);

-- 8. conditions table
CREATE TABLE IF NOT EXISTS conditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roNo INT NOT NULL,
    condition_numbers TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roNo) REFERENCES resowndet(roNo) ON DELETE CASCADE
);

-- 9. restenant table (residential tenant)
CREATE TABLE IF NOT EXISTS restenant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roNo INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    job VARCHAR(255),
    salary_per_month DECIMAL(10,2),
    native_place VARCHAR(255),
    current_address TEXT,
    mobile_number VARCHAR(20),
    alternate_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roNo) REFERENCES resowndet(roNo) ON DELETE CASCADE
);

-- 10. businessownerdet table
CREATE TABLE IF NOT EXISTS businessownerdet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_of_person VARCHAR(255) NOT NULL,
    door_no VARCHAR(50) NOT NULL,
    street VARCHAR(255) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    area VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. businessownerpro table
CREATE TABLE IF NOT EXISTS businessownerpro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    businessownerdet_id INT NOT NULL,
    property_type VARCHAR(100),
    door_facing VARCHAR(50),
    hall_length DECIMAL(10,2),
    hall_breadth DECIMAL(10,2),
    kitchen_available BOOLEAN DEFAULT FALSE,
    washroom_available BOOLEAN DEFAULT FALSE,
    floor_number INT,
    parking_2wheeler BOOLEAN DEFAULT FALSE,
    parking_4wheeler BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (businessownerdet_id) REFERENCES businessownerdet(id) ON DELETE CASCADE
);

-- 12. businessownerrent table
CREATE TABLE IF NOT EXISTS businessownerrent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    businessownerdet_id INT NOT NULL,
    monthly_rent DECIMAL(10,2),
    advance_amount DECIMAL(10,2),
    lease_amount DECIMAL(10,2),
    FOREIGN KEY (businessownerdet_id) REFERENCES businessownerdet(id) ON DELETE CASCADE
);

-- 13. buitenant table (business tenant)
CREATE TABLE IF NOT EXISTS buitenant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    boNo INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    job VARCHAR(255),
    salary_per_month DECIMAL(10,2),
    native_place VARCHAR(255),
    current_address TEXT,
    mobile_number VARCHAR(20),
    alternate_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (boNo) REFERENCES businessownerdet(id) ON DELETE CASCADE
);

-- 14. vehiclesowndet table
CREATE TABLE IF NOT EXISTS vehiclesowndet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_of_person VARCHAR(255) NOT NULL,
    door_no VARCHAR(50) NOT NULL,
    street VARCHAR(255) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    area VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. vehiclesdet table
CREATE TABLE IF NOT EXISTS vehiclesdet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiclesowndet_id INT NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_model VARCHAR(100) NOT NULL,
    seat_capacity INT NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    ac_charge_per_day DECIMAL(10,2),
    ac_charge_per_km DECIMAL(10,2),
    ac_waiting_charge_per_hour DECIMAL(10,2),
    ac_waiting_charge_per_night DECIMAL(10,2),
    ac_fixed BOOLEAN DEFAULT FALSE,
    nonac_charge_per_day DECIMAL(10,2),
    nonac_charge_per_km DECIMAL(10,2),
    nonac_waiting_charge_per_hour DECIMAL(10,2),
    nonac_waiting_charge_per_night DECIMAL(10,2),
    nonac_fixed BOOLEAN DEFAULT FALSE,
    vehicle_images JSON,
    image1 VARCHAR(500),
    image2 VARCHAR(500),
    image3 VARCHAR(500),
    image4 VARCHAR(500),
    image5 VARCHAR(500),
    image6 VARCHAR(500),
    image7 VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicles_owner FOREIGN KEY (vehiclesowndet_id) REFERENCES vehiclesowndet(id) ON DELETE CASCADE
);

-- 16. vehtenant table (vehicle tenant)
CREATE TABLE IF NOT EXISTS vehtenant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicleId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    job VARCHAR(255),
    salary_per_month DECIMAL(10,2),
    native_place VARCHAR(255),
    current_address TEXT,
    mobile_number VARCHAR(20),
    alternate_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicleId) REFERENCES vehiclesdet(id) ON DELETE CASCADE
);

-- 17. machinaryowndet table
CREATE TABLE IF NOT EXISTS machinaryowndet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_of_person VARCHAR(255) NOT NULL,
    door_no VARCHAR(50) NOT NULL,
    street VARCHAR(255) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    area VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. machinarydet table
CREATE TABLE IF NOT EXISTS machinarydet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    machinaryowndet_id INT NOT NULL,
    machinery_type VARCHAR(50) NOT NULL,
    machinery_name VARCHAR(100) NOT NULL,
    machinery_model VARCHAR(100) NOT NULL,
    charge_per_day DECIMAL(10,2),
    charge_per_km DECIMAL(10,2),
    waiting_charge_per_hour DECIMAL(10,2),
    waiting_charge_per_night DECIMAL(10,2),
    is_fixed BOOLEAN DEFAULT FALSE,
    machinery_images JSON,
    image1 VARCHAR(500),
    image2 VARCHAR(500),
    image3 VARCHAR(500),
    image4 VARCHAR(500),
    image5 VARCHAR(500),
    image6 VARCHAR(500),
    image7 VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_machinery_owner FOREIGN KEY (machinaryowndet_id) REFERENCES machinaryowndet(id) ON DELETE CASCADE
);

-- 19. mactenant table (machinery tenant)
CREATE TABLE IF NOT EXISTS mactenant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    machineryId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    job VARCHAR(255),
    salary_per_month DECIMAL(10,2),
    native_place VARCHAR(255),
    current_address TEXT,
    mobile_number VARCHAR(20),
    alternate_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (machineryId) REFERENCES machinarydet(id) ON DELETE CASCADE
);

-- 20. jobgiverdet table (job giver personal info)
CREATE TABLE IF NOT EXISTS jobgiverdet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    shop_type VARCHAR(100) NOT NULL,
    area VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    landmark VARCHAR(255),
    contact VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 21. jobgiverjob table (job details)
CREATE TABLE IF NOT EXISTS jobgiverjob (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobgiverdet_id INT NOT NULL,
    age VARCHAR(50) NOT NULL, -- values: 'Any', '20-30', '30-40', '40-50'
    gender VARCHAR(50) NOT NULL,
    education VARCHAR(100) NOT NULL,
    experience_year VARCHAR(50) NOT NULL,
    experience_field VARCHAR(255) NOT NULL,
    working_time_start VARCHAR(50) NOT NULL,
    working_time_end VARCHAR(50) NOT NULL,
    FOREIGN KEY (jobgiverdet_id) REFERENCES jobgiverdet(id) ON DELETE CASCADE
);

-- 22. jobgiversalary table (salary and skills)
CREATE TABLE IF NOT EXISTS jobgiversalary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobgiverdet_id INT NOT NULL,
    salary_offering DECIMAL(10,2) NOT NULL,
    other_skills TEXT,
    shop_photo1 VARCHAR(500),
    shop_photo2 VARCHAR(500),
    shop_photo3 VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jobgiverdet_id) REFERENCES jobgiverdet(id) ON DELETE CASCADE
);
