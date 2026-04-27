// ===== PromoCode Controller =====
const PromoCode = require('../models/PromoCode');

exports.validateCode = async (req, res) => {
    try {
        const { code, price } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, message: 'Code is required' });
        }

        const validation = await PromoCode.validatePromoCode(code);
        
        if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.message });
        }

        const discount = await PromoCode.calculateDiscount(price, code);
        
        res.json({
            success: true,
            discount,
            finalPrice: price - discount,
            message: `Discount of ₹${discount} applied!`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.applyCode = async (req, res) => {
    try {
        const { code } = req.body;

        const validation = await PromoCode.validatePromoCode(code);
        if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.message });
        }

        await PromoCode.applyPromoCode(code);
        
        res.json({ success: true, message: 'Promo code applied successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getActivePromoCodes = async (req, res) => {
    try {
        const codes = await PromoCode.getAllActive();
        res.json({ success: true, data: codes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = exports;
