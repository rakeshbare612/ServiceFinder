// ===== UserBlock Model =====
const pool = require('../config/db');

class UserBlock {
    static async blockProvider(userId, providerId, reason) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                `INSERT INTO user_blocks (user_id, provider_id, reason)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE reason = ?`,
                [userId, providerId, reason, reason]
            );
        } finally {
            connection.release();
        }
    }

    static async unblockProvider(userId, providerId) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'DELETE FROM user_blocks WHERE user_id = ? AND provider_id = ?',
                [userId, providerId]
            );
        } finally {
            connection.release();
        }
    }

    static async isBlocked(userId, providerId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT id FROM user_blocks WHERE user_id = ? AND provider_id = ?',
                [userId, providerId]
            );
            return rows.length > 0;
        } finally {
            connection.release();
        }
    }

    static async getUserBlockedProviders(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT ub.*, p.name, p.phone, p.profileImage
                 FROM user_blocks ub
                 JOIN providers p ON ub.provider_id = p.id
                 WHERE ub.user_id = ?`,
                [userId]
            );
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = UserBlock;
