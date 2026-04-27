// ===== Admin Routes =====
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/overview', adminController.getOverview);
router.get('/workers', adminController.getWorkers);
router.post('/workers', adminController.addWorker);
router.delete('/workers/:providerId', adminController.removeWorker);
router.get('/complaints', adminController.getComplaints);

module.exports = router;
