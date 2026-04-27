// ===== Complaint Model =====
const pool = require('../config/db');

class Complaint {
    static async getAll() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT c.*, u.name AS userName, p.name AS providerName
                FROM complaints c
                LEFT JOIN users u ON c.user_id = u.id
                LEFT JOIN providers p ON c.provider_id = p.id
                ORDER BY c.created_at DESC
            `);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async getCount() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT COUNT(*) as count FROM complaints');
            return rows[0].count || 0;
        } finally {
            connection.release();
        }
    }
}

module.exports = Complaint;
