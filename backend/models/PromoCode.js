// ===== PromoCode Model =====
const pool = require('../config/db');

class PromoCode {
    static async getByCode(code) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT * FROM promo_codes 
                 WHERE code = ? AND active = 1 
                 AND (expires_at IS NULL OR expires_at > NOW())`,
                [code]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async validatePromoCode(code) {
        const promo = await this.getByCode(code);
        if (!promo) return { valid: false, message: 'Invalid promo code' };
        if (promo.max_uses !== -1 && promo.used_count >= promo.max_uses) {
            return { valid: false, message: 'Promo code limit reached' };
        }
        return { valid: true, discount: promo };
    }

    static async applyPromoCode(code) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE promo_codes SET used_count = used_count + 1 WHERE code = ?',
                [code]
            );
        } finally {
            connection.release();
        }
    }

    static async calculateDiscount(price, promoCode) {
        const promo = await this.getByCode(promoCode);
        if (!promo) return 0;

        if (promo.discount_percent) {
            return (price * promo.discount_percent) / 100;
        } else if (promo.discount_amount) {
            return Math.min(promo.discount_amount, price);
        }
        return 0;
    }

    static async getAllActive() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT * FROM promo_codes 
                 WHERE active = 1 
                 AND (expires_at IS NULL OR expires_at > NOW())
                 ORDER BY created_at DESC`
            );
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = PromoCode;
