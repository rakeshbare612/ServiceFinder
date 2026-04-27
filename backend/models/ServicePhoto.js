// ===== ServicePhoto Model =====
const pool = require('../config/db');

class ServicePhoto {
    static async addPhoto(bookingId, providerId, photoUrl, uploadedBy) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                `INSERT INTO service_photos (booking_id, provider_id, photo_url, uploaded_by)
                 VALUES (?, ?, ?, ?)`,
                [bookingId, providerId, photoUrl, uploadedBy]
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    static async getByBookingId(bookingId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM service_photos WHERE booking_id = ? ORDER BY created_at DESC',
                [bookingId]
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    static async getByProviderId(providerId, limit = 20) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT sp.*, b.date, u.name as customer_name
                 FROM service_photos sp
                 JOIN bookings b ON sp.booking_id = b.id
                 JOIN users u ON b.user_id = u.id
                 WHERE sp.provider_id = ?
                 ORDER BY sp.created_at DESC
                 LIMIT ?`,
                [providerId, limit]
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    static async deletePhoto(id) {
        const connection = await pool.getConnection();
        try {
            await connection.query('DELETE FROM service_photos WHERE id = ?', [id]);
        } finally {
            connection.release();
        }
    }
}

module.exports = ServicePhoto;
