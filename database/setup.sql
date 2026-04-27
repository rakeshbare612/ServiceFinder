-- ===== Service Finder Database Setup =====

-- Create Database
CREATE DATABASE IF NOT EXISTS service_finder;
USE service_finder;

-- ===== Users Table =====
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    provider_id INT DEFAULT NULL,
    role ENUM('customer', 'worker', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== Providers Table (Plumbers) =====
CREATE TABLE IF NOT EXISTS providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    experience INT NOT NULL,
    skills TEXT NOT NULL,
    profileImage VARCHAR(255),
    workerId VARCHAR(50) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 4.5,
    verified TINYINT DEFAULT 1,
    category VARCHAR(50) DEFAULT 'Plumber',
    portfolio_images JSON DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== Services Table =====
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    provider_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 4.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- ===== Bookings Table =====
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) DEFAULT 'Pending',
    cancellation_reason TEXT,
    cancelled_at DATETIME,
    cancelled_by ENUM('user', 'provider', 'admin'),
    rescheduled_from INT DEFAULT NULL,
    completion_notes TEXT,
    completed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id),
    FOREIGN KEY (rescheduled_from) REFERENCES bookings(id)
);

-- ===== Dummy Data - Users =====
-- Sample login credentials:
-- Admin: admin@service.com / Admin@123
-- Worker 1: worker1@service.com / Worker@123
-- Worker 2: worker2@service.com / Worker@123
INSERT INTO users (name, email, password, provider_id, role) VALUES
('Rajesh Kumar', 'rajesh@email.com', '$2a$10$E9rnJO4O7L1qP3K0x8H8h.pLx4v9Z6R2Q0M3N4O5P6Q7R8S9T0U1', NULL, 'customer'),
('Priya Sharma', 'priya@email.com', '$2a$10$E9rnJO4O7L1qP3K0x8H8h.pLx4v9Z6R2Q0M3N4O5P6Q7R8S9T0U1', NULL, 'customer'),
('Vikram Singh', 'vikram@email.com', '$2a$10$E9rnJO4O7L1qP3K0x8H8h.pLx4v9Z6R2Q0M3N4O5P6Q7R8S9T0U1', NULL, 'customer'),
('Worker One', 'worker1@service.com', 'Worker@123', 1, 'worker'),
('Worker Two', 'worker2@service.com', 'Worker@123', 2, 'worker'),
('Admin User', 'admin@service.com', 'Admin@123', NULL, 'admin');

-- ===== Complaints Table =====
CREATE TABLE IF NOT EXISTS complaints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    provider_id INT DEFAULT NULL,
    complaint_type VARCHAR(100) DEFAULT 'Service',
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- ===== Reviews Table =====
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- ===== Dummy Data - Providers (Plumbers) =====
INSERT INTO providers (name, phone, address, experience, skills, workerId, price, rating, verified, profileImage, category, portfolio_images) VALUES
('Ashok Patel', '9876543210', 'Bandra, Mumbai, Maharashtra', 8, 'Pipe fitting, Water leaks, Bathroom plumbing, Installation', 'PL001', 500, 4.8, 1, 'https://i.pravatar.cc/300?img=1', 'Plumber', '["https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400", "https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400&q=50", "https://images.unsplash.com/photo-1536622335107-c8ab7db4dff6?w=400"]'),
('Raj Verma', '9876543211', 'Andheri, Mumbai, Maharashtra', 10, 'Emergency repairs, Maintenance, Drain cleaning, Fixture replacement', 'PL002', 600, 4.7, 1, 'https://i.pravatar.cc/300?img=2', 'Plumber', '["https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400", "https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400&q=60", "https://images.unsplash.com/photo-1536622335107-c8ab7db4dff6?w=400"]'),
('Sunil Desai', '9876543212', 'Pune, Maharashtra', 6, 'Wall mounting, Leak detection, Kitchen plumbing, Renovations', 'PL003', 450, 4.6, 1, 'https://i.pravatar.cc/300?img=3', 'Electrician', '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=50"]'),
('Ramesh Gupta', '9876543213', 'Navi Mumbai, Maharashtra', 12, 'High-rise installations, Industrial plumbing, Gas fitting, Solar installation', 'PL004', 700, 4.9, 1, 'https://i.pravatar.cc/300?img=4', 'Carpenter', '["https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400", "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&q=50"]'),
('Deepak Singh', '9876543214', 'Dadar, Mumbai, Maharashtra', 7, 'Water tank cleaning, Pipe replacement, Faucet repair, Plumbing design', 'PL005', 550, 4.5, 1, 'https://i.pravatar.cc/300?img=5', 'Painter', '["https://images.unsplash.com/photo-1589939705066-5470d7b23b0d?w=400", "https://images.unsplash.com/photo-1589939705066-5470d7b23b0d?w=400&q=50"]'),
('Arun Kumar', '9876543215', 'Thane, Maharashtra', 5, 'Bathroom renovation, Pipe joints, Leakage repair, Basic maintenance', 'PL006', 400, 4.4, 1, 'https://i.pravatar.cc/300?img=6', 'Plumber', '["https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400"]'),
('Vikas Sharma', '9876543216', 'Nagpur, Maharashtra', 9, 'Drainage systems, Water supply, Ventilation, Construction plumbing', 'PL007', 650, 4.8, 1, 'https://i.pravatar.cc/300?img=7', 'AC Technician', '["https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400"]'),
('Mohit Jain', '9876543217', 'Powai, Mumbai, Maharashtra', 4, 'Quick fixes, Emergency calls, Pipe cutting, General maintenance', 'PL008', 350, 4.3, 1, 'https://i.pravatar.cc/300?img=8', 'Home Cleaning', '["https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400"]');

-- ===== Dummy Data - Services =====
INSERT INTO services (title, provider_id, price, location, rating) VALUES
('Pipe Fitting Service', 1, 500, 'Bandra, Mumbai', 4.8),
('Water Leak Repair', 2, 600, 'Andheri, Mumbai', 4.7),
('Bathroom Plumbing', 3, 450, 'Pune', 4.6),
('Emergency Plumbing', 4, 700, 'Navi Mumbai', 4.9),
('Tank Cleaning', 5, 550, 'Dadar, Mumbai', 4.5),
('Installation Service', 6, 400, 'Thane', 4.4),
('Drain Repair', 7, 650, 'Nagpur', 4.8),
('Quick Fixes', 8, 350, 'Powai, Mumbai', 4.3);

-- ===== Dummy Data - Complaints =====
INSERT INTO complaints (user_id, provider_id, complaint_type, message, status) VALUES
(1, 1, 'Service Delay', 'Provider arrived late and the repair took longer than promised.', 'Open'),
(2, 3, 'Quality', 'The bathroom plumbing job still has a leak after completion.', 'Open'),
(3, 2, 'Billing', 'The final bill was higher than the quoted price.', 'Closed');

-- Verify data insertion
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_providers FROM providers;
SELECT COUNT(*) as total_services FROM services;

-- ===== Wallet/Credits System Tables =====
CREATE TABLE IF NOT EXISTS wallets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    wallet_id INT NOT NULL,
    amount DECIMAL(10, 2),
    type ENUM('credit', 'debit'),
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);

-- ===== Promotional Codes Table =====
CREATE TABLE IF NOT EXISTS promo_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT,
    discount_amount DECIMAL(10, 2),
    max_uses INT DEFAULT -1,
    used_count INT DEFAULT 0,
    active TINYINT DEFAULT 1,
    expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== User Blocks Table =====
CREATE TABLE IF NOT EXISTS user_blocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id),
    UNIQUE KEY unique_block (user_id, provider_id)
);

-- ===== Dispute Resolution Table =====
CREATE TABLE IF NOT EXISTS disputes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    provider_id INT NOT NULL,
    subject VARCHAR(255),
    description TEXT,
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- ===== Service Completion Photos Table =====
CREATE TABLE IF NOT EXISTS service_photos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    provider_id INT NOT NULL,
    photo_url VARCHAR(500),
    uploaded_by ENUM('provider', 'customer'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- ===== Provider Availability Table =====
CREATE TABLE IF NOT EXISTS provider_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    provider_id INT NOT NULL,
    day_of_week INT,
    start_time TIME,
    end_time TIME,
    is_available TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- ===== Notifications Table =====
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    data JSON,
    is_read TINYINT DEFAULT 0,
    read_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ===== Analytics Table =====
CREATE TABLE IF NOT EXISTS analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    provider_id INT,
    user_id INT,
    event_type VARCHAR(100),
    event_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ===== Create Initial Wallets =====
INSERT INTO wallets (user_id, balance) VALUES
(1, 5000),
(2, 3000),
(3, 2500);

-- ===== Sample Promo Codes =====
INSERT INTO promo_codes (code, discount_percent, max_uses, active) VALUES
('SAVE20', 20, 100, 1),
('FIRST50', 50, 10, 1),
('FLAT100', NULL, 50, 1),
('LOYAL10', 10, -1, 1);
