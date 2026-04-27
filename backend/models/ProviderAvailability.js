// ===== ProviderAvailability Model =====
const pool = require('../config/db');

class ProviderAvailability {
    static async setAvailability(providerId, dayOfWeek, startTime, endTime) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                `INSERT INTO provider_availability (provider_id, day_of_week, start_time, end_time)
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE start_time = ?, end_time = ?`,
                [providerId, dayOfWeek, startTime, endTime, startTime, endTime]
            );
        } finally {
            connection.release();
        }
    }

    static async getAvailability(providerId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT * FROM provider_availability 
                 WHERE provider_id = ? AND is_available = 1
                 ORDER BY day_of_week ASC`,
                [providerId]
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    static async isAvailableNow(providerId) {
        const connection = await pool.getConnection();
        try {
            const dayOfWeek = new Date().getDay();
            const currentTime = new Date().toTimeString().slice(0, 8);

            const [rows] = await connection.query(
                `SELECT * FROM provider_availability
                 WHERE provider_id = ? AND day_of_week = ? AND is_available = 1
                 AND start_time <= ? AND end_time >= ?`,
                [providerId, dayOfWeek, currentTime, currentTime]
            );
            return rows.length > 0;
        } finally {
            connection.release();
        }
    }

    static async toggleAvailability(providerId, dayOfWeek, isAvailable) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                `UPDATE provider_availability SET is_available = ?
                 WHERE provider_id = ? AND day_of_week = ?`,
                [isAvailable ? 1 : 0, providerId, dayOfWeek]
            );
        } finally {
            connection.release();
        }
    }
}

module.exports = ProviderAvailability;
