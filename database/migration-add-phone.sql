-- ===== Migration: Add Phone Column to Users Table =====
-- This migration adds a phone column to the users table
-- Run this after the initial setup if the column doesn't exist

USE service_finder;

-- Add phone column if it doesn't exist
ALTER TABLE users ADD COLUMN phone VARCHAR(15) AFTER password;

-- Update sample users with phone numbers
UPDATE users SET phone = '9876543210' WHERE email = 'rajesh@email.com';
UPDATE users SET phone = '9876543211' WHERE email = 'priya@email.com';
UPDATE users SET phone = '9876543212' WHERE email = 'vikram@email.com';
UPDATE users SET phone = '9876543213' WHERE email = 'worker1@service.com';
UPDATE users SET phone = '9876543214' WHERE email = 'worker2@service.com';
UPDATE users SET phone = '9876543215' WHERE email = 'admin@service.com';

-- Verify the column was added
SELECT id, name, email, phone FROM users LIMIT 10;
