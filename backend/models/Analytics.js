// ===== Analytics Model =====
const pool = require('../config/db');

class Analytics {
    static async trackEvent(providerId, userId, eventType, eventData) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                `INSERT INTO analytics (provider_id, user_id, event_type, event_data)
                 VALUES (?, ?, ?, ?)`,
                [providerId, userId, eventType, eventData ? JSON.stringify(eventData) : null]
            );
        } finally {
            connection.release();
        }
    }

    static async getProviderStats(providerId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT 
                    COUNT(DISTINCT booking_id) as total_bookings,
                    COUNT(DISTINCT user_id) as unique_customers,
                    SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) as profile_views,
                    SUM(CASE WHEN event_type = 'booking' THEN 1 ELSE 0 END) as bookings_made,
                    SUM(CASE WHEN event_type = 'review' THEN 1 ELSE 0 END) as reviews_received
                 FROM analytics WHERE provider_id = ?`,
                [providerId]
            );
            return rows[0] || {};
        } finally {
            connection.release();
        }
    }

    static async getPlatformStats() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT 
                    COUNT(DISTINCT provider_id) as total_providers,
                    COUNT(DISTINCT user_id) as total_users,
                    SUM(CASE WHEN event_type = 'booking' THEN 1 ELSE 0 END) as total_bookings,
                    SUM(CASE WHEN event_type = 'review' THEN 1 ELSE 0 END) as total_reviews
                 FROM analytics`
            );
            return rows[0] || {};
        } finally {
            connection.release();
        }
    }

    static async getRevenueStats() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as bookings,
                    SUM(CASE WHEN event_type = 'payment' THEN 1 ELSE 0 END) as payments
                 FROM analytics
                 WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                 GROUP BY DATE(created_at)
                 ORDER BY date DESC`
            );
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = Analytics;
