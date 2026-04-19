-- Run this in MySQL Workbench to set up the AutoWala database

CREATE DATABASE IF NOT EXISTS autowala;
USE autowala;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    vehicle_number VARCHAR(20),
    status ENUM('available', 'busy', 'offline') DEFAULT 'available',
    rating DECIMAL(2,1) DEFAULT 4.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    drop_location VARCHAR(255) NOT NULL,
    driver_id INT,
    status ENUM('pending', 'accepted', 'ongoing', 'completed', 'cancelled') DEFAULT 'pending',
    fare DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Sample Drivers (for testing)
INSERT INTO drivers (name, mobile, vehicle_number, status) VALUES
('Ramesh Kumar', '9876543210', 'KL01AB1234', 'available'),
('Suresh Nair', '9876543211', 'KL02CD5678', 'available'),
('Arun Menon', '9876543212', 'KL03EF9012', 'available'),
('Vijay Das', '9876543213', 'KL04GH3456', 'offline'),
('Mohan Lal', '9876543214', 'KL05IJ7890', 'available');

SELECT 'AutoWala DB Setup Complete ✅' AS message;
