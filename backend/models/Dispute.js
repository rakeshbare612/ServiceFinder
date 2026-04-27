// ===== Dispute Model =====
const pool = require('../config/db');

class Dispute {
    static async create(bookingId, userId, providerId, subject, description) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                `INSERT INTO disputes (booking_id, user_id, provider_id, subject, description)
                 VALUES (?, ?, ?, ?, ?)`,
                [bookingId, userId, providerId, subject, description]
            );
            return this.findById(result.insertId);
        } finally {
            connection.release();
        }
    }

    static async findById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM disputes WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async getByUserId(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT d.*, b.date, p.name as provider_name
                 FROM disputes d
                 JOIN bookings b ON d.booking_id = b.id
                 JOIN providers p ON d.provider_id = p.id
                 WHERE d.user_id = ?
                 ORDER BY d.created_at DESC`,
                [userId]
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    static async updateStatus(id, status, resolutionNotes = null) {
        const connection = await pool.getConnection();
        try {
            if (status === 'Resolved' || status === 'Closed') {
                await connection.query(
                    `UPDATE disputes SET status = ?, resolution_notes = ?, resolved_at = NOW()
                     WHERE id = ?`,
                    [status, resolutionNotes, id]
                );
            } else {
                await connection.query(
                    'UPDATE disputes SET status = ? WHERE id = ?',
                    [status, id]
                );
            }
        } finally {
            connection.release();
        }
    }

    static async getAll() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT d.*, u.name as user_name, p.name as provider_name, b.date
                 FROM disputes d
                 JOIN users u ON d.user_id = u.id
                 JOIN providers p ON d.provider_id = p.id
                 JOIN bookings b ON d.booking_id = b.id
                 ORDER BY d.created_at DESC`
            );
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = Dispute;
