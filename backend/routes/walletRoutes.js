// ===== Wallet Routes =====
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Get user's wallet balance
router.get('/balance', walletController.getBalance);

// Get transaction history
router.get('/history', walletController.getTransactionHistory);

// Add credits to wallet
router.post('/add-credits', walletController.addCredits);

// Deduct credits from wallet
router.post('/deduct', walletController.deductCredits);

module.exports = router;
