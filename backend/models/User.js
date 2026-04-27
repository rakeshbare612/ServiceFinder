// ===== User Model =====
const pool = require('../config/db');

class User {
    static async findByEmail(email) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async findById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM users WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async deleteByProviderId(providerId) {
        const connection = await pool.getConnection();
        try {
            await connection.query('DELETE FROM users WHERE provider_id = ?', [providerId]);
        } finally {
            connection.release();
        }
    }

    static async create(name, email, password, role = 'customer', providerId = null) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'INSERT INTO users (name, email, password, role, provider_id) VALUES (?, ?, ?, ?, ?)',
                [name, email, password, role, providerId]
            );
            return this.findByEmail(email);
        } finally {
            connection.release();
        }
    }

    static async getAll() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users');
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = User;
