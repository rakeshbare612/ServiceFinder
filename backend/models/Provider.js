// ===== Provider Model =====
const pool = require('../config/db');

class Provider {
    static async getAll(search = null) {
        const connection = await pool.getConnection();
        try {
            let query = 'SELECT * FROM providers';
            const params = [];

            if (search) {
                query += ' WHERE name LIKE ? OR address LIKE ?';
                params.push(`%${search}%`, `%${search}%`);
            }

            const [rows] = await connection.query(query, params);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async findById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM providers WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async create(data) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO providers (name, phone, address, experience, skills, profileImage, workerId, price, rating, verified, category, portfolio_images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    data.name,
                    data.phone,
                    data.address,
                    data.experience,
                    data.skills,
                    data.profileImage,
                    data.workerId,
                    data.price,
                    data.rating,
                    data.verified || 1,
                    data.category || 'Plumber',
                    JSON.stringify(data.portfolio_images || [])
                ]
            );
            const providerId = result.insertId;
            return this.findById(providerId);
        } finally {
            connection.release();
        }
    }

    static async delete(providerId) {
        const connection = await pool.getConnection();
        try {
            await connection.query('DELETE FROM providers WHERE id = ?', [providerId]);
        } finally {
            connection.release();
        }
    }

    static async getCount() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT COUNT(*) as count FROM providers');
            return rows[0].count || 0;
        } finally {
            connection.release();
        }
    }

    static async getAllWithWorkerInfo() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT p.*, u.email AS workerEmail, u.role, u.provider_id
                FROM providers p
                LEFT JOIN users u ON u.provider_id = p.id AND u.role = 'worker'
            `);
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = Provider;
