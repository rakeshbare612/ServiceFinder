// ===== Booking Model =====
const pool = require('../config/db');

class Booking {
    static async create(data) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(
                'INSERT INTO bookings (user_id, provider_id, date, time, latitude, longitude, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    data.userId,
                    data.providerId,
                    data.date,
                    data.time,
                    data.latitude,
                    data.longitude,
                    'Pending'
                ]
            );
            return {
                id: result[0].insertId,
                ...data,
                status: 'Pending'
            };
        } finally {
            connection.release();
        }
    }

    static async getUserBookings(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT b.*, p.name as providerName, p.phone, p.address, p.price
                FROM bookings b
                JOIN providers p ON b.provider_id = p.id
                WHERE b.user_id = ?
                ORDER BY b.date DESC
            `, [userId]);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async getProviderBookings(providerId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT b.*, p.name as providerName, p.phone, p.address, p.price, u.name as userName, u.phone as userPhone
                FROM bookings b
                JOIN providers p ON b.provider_id = p.id
                JOIN users u ON b.user_id = u.id
                WHERE b.provider_id = ?
                ORDER BY b.date DESC
            `, [providerId]);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async getAll() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT b.*, p.name as providerName, p.phone, p.address, u.name as userName, u.email
                FROM bookings b
                JOIN providers p ON b.provider_id = p.id
                JOIN users u ON b.user_id = u.id
                ORDER BY b.date DESC
            `);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async updateStatus(bookingId, status) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE bookings SET status = ? WHERE id = ?',
                [status, bookingId]
            );
        } finally {
            connection.release();
        }
    }

    static async cancelBooking(bookingId, cancellationReason, cancelledBy) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                `UPDATE bookings 
                 SET status = 'Cancelled', cancellation_reason = ?, cancelled_at = NOW(), cancelled_by = ?
                 WHERE id = ?`,
                [cancellationReason, cancelledBy, bookingId]
            );
        } finally {
            connection.release();
        }
    }

    static async rescheduleBooking(bookingId, newDate, newTime) {
        const connection = await pool.getConnection();
        try {
            // Create new booking with rescheduled_from
            const [rows] = await connection.query(
                'SELECT * FROM bookings WHERE id = ?',
                [bookingId]
            );
            const oldBooking = rows[0];

            if (!oldBooking) return null;

            const [result] = await connection.query(
                `INSERT INTO bookings (user_id, provider_id, date, time, latitude, longitude, status, rescheduled_from)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [oldBooking.user_id, oldBooking.provider_id, newDate, newTime, 
                 oldBooking.latitude, oldBooking.longitude, 'Pending', bookingId]
            );

            // Mark old booking as rescheduled
            await connection.query(
                'UPDATE bookings SET status = "Rescheduled" WHERE id = ?',
                [bookingId]
            );

            return { id: result.insertId, ...oldBooking, date: newDate, time: newTime };
        } finally {
            connection.release();
        }
    }

    static async completeBooking(bookingId, completionNotes) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                `UPDATE bookings 
                 SET status = 'Completed', completion_notes = ?, completed_at = NOW()
                 WHERE id = ?`,
                [completionNotes, bookingId]
            );
        } finally {
            connection.release();
        }
    }

    static async findById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT b.*, p.name as providerName, p.phone, u.name as userName
                 FROM bookings b
                 JOIN providers p ON b.provider_id = p.id
                 JOIN users u ON b.user_id = u.id
                 WHERE b.id = ?`,
                [id]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async getCountByStatus(status) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT COUNT(*) as count FROM bookings WHERE status = ?',
                [status]
            );
            return rows[0].count || 0;
        } finally {
            connection.release();
        }
    }

    static async getWorkerStats() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT 
                    p.id,
                    p.name,
                    COUNT(CASE WHEN b.status = 'Completed' THEN 1 END) as completed_jobs,
                    COUNT(CASE WHEN b.status = 'Pending' THEN 1 END) as pending_jobs,
                    COUNT(CASE WHEN b.status = 'Accepted' THEN 1 END) as accepted_jobs,
                    COUNT(b.id) as total_jobs,
                    ROUND(
                        (COUNT(CASE WHEN b.status = 'Completed' THEN 1 END) * 100.0) / 
                        NULLIF(COUNT(b.id), 0), 1
                    ) as completion_rate
                FROM providers p
                LEFT JOIN bookings b ON p.id = b.provider_id
                GROUP BY p.id, p.name
                ORDER BY completion_rate DESC
            `);
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = Booking;
