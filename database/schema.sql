-- Create database
CREATE DATABASE IF NOT EXISTS travelease_db;
USE travelease_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT NOT NULL CHECK (age >= 18),
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL CHECK (age >= 21),
    id_card_number VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agencies table
CREATE TABLE IF NOT EXISTS agencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Buses table
CREATE TABLE IF NOT EXISTS buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(255) NOT NULL UNIQUE,
    destination VARCHAR(255) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    total_seats INT NOT NULL CHECK (total_seats > 0),
    available_seats INT NOT NULL CHECK (available_seats >= 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    current_location VARCHAR(255) NOT NULL,
    agency_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    seat_number INT NOT NULL CHECK (seat_number > 0),
    number_of_seats INT NOT NULL CHECK (number_of_seats > 0),
    passenger_name VARCHAR(255) NOT NULL,
    id_number VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    ticket_number VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Insert sample data

-- Sample agencies
INSERT INTO agencies (name, location, description) VALUES
('Vatican Express', 'Douala', 'Premium bus service with modern amenities'),
('General Express', 'Yaoundé', 'Reliable transportation across Cameroon'),
('Nso Boys', 'Bamenda', 'Comfortable travel to the Northwest region'),
('Golden Express', 'Buea', 'Express service to Southwest Cameroon'),
('Musango Express', 'Limbe', 'Coastal transportation specialists'),
('The People Express', 'Bafoussam', 'Community-focused travel solutions');

-- Sample drivers
INSERT INTO drivers (name, age, id_card_number) VALUES
('Emmanuel Mbarga', 42, 'CM123456789'),
('Paul Nkeng', 38, 'CM987654321'),
('Jean Tabi', 45, 'CM456789123'),
('Marie Fombi', 35, 'CM654321987'),
('Joseph Kameni', 40, 'CM789123456'),
('Grace Nkem', 37, 'CM321987654');

-- Sample buses
INSERT INTO buses (bus_number, destination, departure_time, arrival_time, total_seats, available_seats, price, current_location, agency_id, driver_id) VALUES
('VE-001', 'Yaoundé', '08:00:00', '18:30:00', 45, 12, 5000.00, 'Douala', 1, 1),
('VE-002', 'Bamenda', '09:30:00', '17:00:00', 45, 8, 6500.00, 'Douala', 1, 2),
('GE-001', 'Douala', '07:30:00', '18:00:00', 50, 10, 5000.00, 'Yaoundé', 2, 3),
('NB-001', 'Douala', '06:00:00', '16:30:00', 40, 5, 6500.00, 'Bamenda', 3, 4),
('GX-001', 'Douala', '07:00:00', '17:30:00', 45, 20, 4000.00, 'Buea', 4, 5),
('ME-001', 'Douala', '08:15:00', '18:45:00', 42, 18, 4500.00, 'Limbe', 5, 6);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'ADMIN', 'MODERATOR') DEFAULT 'ADMIN',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO admins (username, email, password, full_name, role) VALUES
('admin', 'admin@travelease.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'SUPER_ADMIN');
