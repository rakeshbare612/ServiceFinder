// ===== Booking Controller - Extended with Cancellation & Rescheduling =====
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { reason } = req.body;
        const userId = req.user?.id || req.userId;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await Booking.cancelBooking(bookingId, reason, 'user');
        
        // Notify provider
        await Notification.create(
            booking.provider_id,
            'booking_cancelled',
            'Booking Cancelled',
            `Booking #${bookingId} has been cancelled by the customer`,
            { bookingId }
        );

        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.rescheduleBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { newDate, newTime } = req.body;
        const userId = req.user?.id || req.userId;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const newBooking = await Booking.rescheduleBooking(bookingId, newDate, newTime);
        
        // Notify provider
        await Notification.create(
            booking.provider_id,
            'booking_rescheduled',
            'Booking Rescheduled',
            `Booking rescheduled to ${newDate} at ${newTime}`,
            { bookingId, newBookingId: newBooking.id, newDate, newTime }
        );

        res.json({ success: true, message: 'Booking rescheduled successfully', data: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.completeBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { notes } = req.body;
        const providerId = req.user?.provider_id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.provider_id !== providerId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await Booking.completeBooking(bookingId, notes);
        
        // Notify user
        await Notification.create(
            booking.user_id,
            'booking_completed',
            'Service Completed',
            `Your booking #${bookingId} has been completed. Please leave a review!`,
            { bookingId }
        );

        res.json({ success: true, message: 'Booking marked as completed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = exports;
