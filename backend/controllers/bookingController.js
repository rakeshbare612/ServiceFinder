// ===== Bookings Controller =====
const Booking = require('../models/Booking');

// Sample bookings data for demo
let nextSampleBookingId = 9;
const sampleBookings = {
    1: [ // Provider ID 1 (Amit Sharma)
        { id: 1, userId: 1, providerId: 1, date: '2024-01-20', time: '10:00:00', latitude: 19.0760, longitude: 72.8777, status: 'Completed', userName: 'John Doe', providerName: 'Amit Sharma', phone: '+91 98765 43210', address: 'Dadar, Mumbai', price: 450 },
        { id: 2, userId: 2, providerId: 1, date: '2024-01-22', time: '14:00:00', latitude: 19.0760, longitude: 72.8777, status: 'Accepted', userName: 'Jane Smith', providerName: 'Amit Sharma', phone: '+91 98765 43210', address: 'Dadar, Mumbai', price: 450 },
        { id: 3, userId: 3, providerId: 1, date: '2024-01-25', time: '16:00:00', latitude: 19.0760, longitude: 72.8777, status: 'Pending', userName: 'Mike Johnson', providerName: 'Amit Sharma', phone: '+91 98765 43210', address: 'Dadar, Mumbai', price: 450 }
    ],
    2: [ // Provider ID 2 (Nisha Patel)
        { id: 4, userId: 4, providerId: 2, date: '2024-01-18', time: '11:00:00', latitude: 18.5204, longitude: 73.8567, status: 'Completed', userName: 'Sarah Wilson', providerName: 'Nisha Patel', phone: '+91 99876 54321', address: 'Pune, Maharashtra', price: 420 },
        { id: 5, userId: 5, providerId: 2, date: '2024-01-23', time: '13:00:00', latitude: 18.5204, longitude: 73.8567, status: 'Accepted', userName: 'Tom Brown', providerName: 'Nisha Patel', phone: '+91 99876 54321', address: 'Pune, Maharashtra', price: 420 }
    ],
    3: [ // Provider ID 3 (Raj Verma)
        { id: 6, userId: 6, providerId: 3, date: '2024-01-19', time: '09:00:00', latitude: 19.2183, longitude: 72.9781, status: 'Completed', userName: 'Lisa Davis', providerName: 'Raj Verma', phone: '+91 91234 56789', address: 'Thane, Maharashtra', price: 500 },
        { id: 7, userId: 7, providerId: 3, date: '2024-01-21', time: '15:00:00', latitude: 19.2183, longitude: 72.9781, status: 'Completed', userName: 'David Miller', providerName: 'Raj Verma', phone: '+91 91234 56789', address: 'Thane, Maharashtra', price: 500 },
        { id: 8, userId: 8, providerId: 3, date: '2024-01-24', time: '17:00:00', latitude: 19.2183, longitude: 72.9781, status: 'Accepted', userName: 'Emma Garcia', providerName: 'Raj Verma', phone: '+91 91234 56789', address: 'Thane, Maharashtra', price: 500 }
    ]
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        let bookings;
        try {
            bookings = await Booking.getUserBookings(userId);
        } catch (dbError) {
            console.error('Database error in getUserBookings:', dbError.message);
            bookings = Object.values(sampleBookings).flat().filter(b => b.userId === parseInt(userId, 10));
        }

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get worker bookings for a provider
exports.getWorkerBookings = async (req, res) => {
    const { providerId } = req.query;

    try {
        if (!providerId) {
            return res.status(400).json({ success: false, message: 'Provider ID is required' });
        }

        const bookings = await Booking.getProviderBookings(providerId);

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Database error in getWorkerBookings:', error.message);
        // Return sample bookings when DB fails
        const providerBookings = sampleBookings[parseInt(providerId)] || [];
        res.json({
            success: true,
            data: providerBookings
        });
    }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.getAll();
        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create booking
exports.createBooking = async (req, res) => {
    try {
        const { userId, providerId, date, time, latitude, longitude, userName } = req.body;

        if (!userId || !providerId || !date || !time || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        try {
            const booking = await Booking.create({
                userId,
                providerId,
                date,
                time,
                latitude,
                longitude
            });

            return res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: booking
            });
        } catch (dbError) {
            console.error('Database booking failed, using sample fallback:', dbError.message);

            const bookingId = nextSampleBookingId++;
            const providerName = sampleBookings[providerId] && sampleBookings[providerId][0]
                ? sampleBookings[providerId][0].providerName
                : `Provider #${providerId}`;
            const address = sampleBookings[providerId] && sampleBookings[providerId][0]
                ? sampleBookings[providerId][0].address
                : 'Unknown';

            const booking = {
                id: bookingId,
                userId: parseInt(userId, 10),
                providerId: parseInt(providerId, 10),
                date,
                time,
                latitude,
                longitude,
                status: 'Pending',
                userName: userName || 'Customer',
                providerName,
                phone: '',
                address,
                price: 0
            };

            if (!sampleBookings[providerId]) {
                sampleBookings[providerId] = [];
            }
            sampleBookings[providerId].push(booking);

            return res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: booking
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log('updateBookingStatus called', { id, status });

        if (!status) {
            return res.status(400).json({ success: false, message: 'Status is required' });
        }

        try {
            await Booking.updateStatus(id, status);
        } catch (dbError) {
            console.error('Database update failed, falling back to demo bookings:', dbError);
            const bookingId = parseInt(id, 10);
            let found = false;

            Object.values(sampleBookings).forEach(bookings => {
                bookings.forEach(booking => {
                    if (booking.id === bookingId) {
                        booking.status = status;
                        found = true;
                    }
                });
            });

            if (!found) {
                console.error('Fallback update failed: booking not found in sample bookings', bookingId);
                return res.status(500).json({ success: false, message: 'Booking update failed' });
            }
        }

        res.json({
            success: true,
            message: 'Booking status updated successfully'
        });
    } catch (error) {
        console.error('updateBookingStatus error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};
