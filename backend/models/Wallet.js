// ===== Wallet Model =====
const pool = require('../config/db');

class Wallet {
    static async getBalance(userId, callback) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT balance FROM wallets WHERE user_id = ?',
                [userId]
            );
            return rows[0]?.balance || 0;
        } finally {
            connection.release();
        }
    }

    static async createWallet(userId) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'INSERT INTO wallets (user_id, balance) VALUES (?, ?)',
                [userId, 0]
            );
        } finally {
            connection.release();
        }
    }

    static async addCredits(userId, amount, description) {
        const connection = await pool.getConnection();
        try {
            // Get or create wallet
            const [wallet] = await connection.query(
                'SELECT id FROM wallets WHERE user_id = ?',
                [userId]
            );
            let walletId = wallet[0]?.id;

            if (!walletId) {
                const [result] = await connection.query(
                    'INSERT INTO wallets (user_id, balance) VALUES (?, ?)',
                    [userId, 0]
                );
                walletId = result.insertId;
            }

            // Add credits
            await connection.query(
                'UPDATE wallets SET balance = balance + ? WHERE id = ?',
                [amount, walletId]
            );

            // Log transaction
            await connection.query(
                'INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)',
                [walletId, amount, 'credit', description]
            );

            return true;
        } finally {
            connection.release();
        }
    }

    static async deductCredits(userId, amount, description) {
        const connection = await pool.getConnection();
        try {
            const [wallet] = await connection.query(
                'SELECT id, balance FROM wallets WHERE user_id = ?',
                [userId]
            );

            if (!wallet[0] || wallet[0].balance < amount) {
                return false;
            }

            const walletId = wallet[0].id;

            // Deduct credits
            await connection.query(
                'UPDATE wallets SET balance = balance - ? WHERE id = ?',
                [amount, walletId]
            );

            // Log transaction
            await connection.query(
                'INSERT INTO wallet_transactions (wallet_id, amount, type, description) VALUES (?, ?, ?, ?)',
                [walletId, amount, 'debit', description]
            );

            return true;
        } finally {
            connection.release();
        }
    }

    static async getTransactionHistory(userId, limit = 10) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT t.* FROM wallet_transactions t
                 JOIN wallets w ON w.id = t.wallet_id
                 WHERE w.user_id = ?
                 ORDER BY t.created_at DESC
                 LIMIT ?`,
                [userId, limit]
            );
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = Wallet;
