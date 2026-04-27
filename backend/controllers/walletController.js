// ===== Wallet Controller =====
const Wallet = require('../models/Wallet');

exports.getBalance = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const balance = await Wallet.getBalance(userId);
        res.json({ success: true, balance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const limit = req.query.limit || 10;
        const history = await Wallet.getTransactionHistory(userId, limit);
        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addCredits = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const { amount, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        await Wallet.addCredits(userId, amount, description);
        const newBalance = await Wallet.getBalance(userId);
        
        res.json({ success: true, message: 'Credits added', balance: newBalance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deductCredits = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const { amount, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const success = await Wallet.deductCredits(userId, amount, description);
        
        if (!success) {
            return res.status(400).json({ success: false, message: 'Insufficient credits' });
        }

        const newBalance = await Wallet.getBalance(userId);
        res.json({ success: true, message: 'Credits deducted', balance: newBalance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = exports;
