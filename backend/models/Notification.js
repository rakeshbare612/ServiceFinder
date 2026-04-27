// ===== Notification Model =====
const pool = require('../config/db');

class Notification {
    static async create(userId, type, title, message, data = null) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                `INSERT INTO notifications (user_id, type, title, message, data)
                 VALUES (?, ?, ?, ?, ?)`,
                [userId, type, title, message, data ? JSON.stringify(data) : null]
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    static async getUnread(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT * FROM notifications 
                 WHERE user_id = ? AND is_read = 0
                 ORDER BY created_at DESC`,
                [userId]
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    static async getAll(userId, limit = 20) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT * FROM notifications 
                 WHERE user_id = ?
                 ORDER BY created_at DESC
                 LIMIT ?`,
                [userId, limit]
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    static async markAsRead(notificationId) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?',
                [notificationId]
            );
        } finally {
            connection.release();
        }
    }

    static async markAllAsRead(userId) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0',
                [userId]
            );
        } finally {
            connection.release();
        }
    }

    static async delete(notificationId) {
        const connection = await pool.getConnection();
        try {
            await connection.query('DELETE FROM notifications WHERE id = ?', [notificationId]);
        } finally {
            connection.release();
        }
    }
}

module.exports = Notification;
