// ===== Bookings Routes =====
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getUserBookings);
router.get('/worker', bookingController.getWorkerBookings);
router.get('/admin/all', bookingController.getAllBookings);
router.patch('/:id/status', bookingController.updateBookingStatus);

module.exports = router;
