-- ===== SQL Test Queries =====
-- Use after running setup.sql

USE service_finder;

-- ===== View All Users =====
SELECT 'USERS' as 'Table';
SELECT id, name, email, created_at FROM users;

-- ===== View All Providers =====
SELECT 'PROVIDERS' as 'Table';
SELECT id, name, phone, address, experience, price, rating FROM providers;

-- ===== View All Services =====
SELECT 'SERVICES' as 'Table';
SELECT id, title, provider_id, price, location, rating FROM services;

-- ===== View All Bookings =====
SELECT 'BOOKINGS' as 'Table';
SELECT COUNT(*) as total_bookings FROM bookings;

-- ===== Verify Data Counts =====
SELECT 
    'Total Users' as metric, COUNT(*) as count FROM users
UNION ALL
SELECT 'Total Providers', COUNT(*) FROM providers
UNION ALL
SELECT 'Total Services', COUNT(*) FROM services
UNION ALL
SELECT 'Total Bookings', COUNT(*) FROM bookings;

-- ===== Find Providers by Location =====
SELECT 'Providers in Mumbai:' as '';
SELECT name, phone, address, price, rating FROM providers WHERE address LIKE '%Mumbai%';

-- ===== Get Provider with Rating =====
SELECT 'Top Rated Plumbers:' as '';
SELECT name, phone, workerId, rating, price FROM providers ORDER BY rating DESC LIMIT 5;

-- ===== Calculate Average Rating =====
SELECT 'Ratings Summary:' as '';
SELECT 
    COUNT(*) as total_providers,
    ROUND(AVG(rating), 2) as avg_rating,
    MAX(rating) as highest_rating,
    MIN(rating) as lowest_rating
FROM providers;

-- ===== Test Insert (Comment out to prevent duplicates) =====
-- INSERT INTO bookings (user_id, provider_id, date, time, latitude, longitude, status)
-- VALUES (1, 1, CURDATE() + INTERVAL 1 DAY, '10:00:00', 19.0760, 72.8777, 'Pending');

-- ===== Verify Maharashtra Location Bounds =====
SELECT 'Maharashtra Bounds:' as '';
SELECT 'North: 22.7°N, South: 12.4°N, East: 80.9°E, West: 72.6°E' as bounds;
