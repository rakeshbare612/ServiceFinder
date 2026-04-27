const db = require('../config/db');

class Review {
    // Get all reviews for a provider
    static getProviderReviews(providerId, callback) {
        const query = `
            SELECT r.*, u.name as reviewer_name, u.id as user_id
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.provider_id = ?
            ORDER BY r.created_at DESC
        `;
        db.query(query, [providerId], callback);
    }

    // Get review by booking
    static getByBooking(bookingId, callback) {
        const query = 'SELECT * FROM reviews WHERE booking_id = ?';
        db.query(query, [bookingId], callback);
    }

    // Create a new review
    static create(bookingId, userId, providerId, rating, comment, callback) {
        const query = `
            INSERT INTO reviews (booking_id, user_id, provider_id, rating, comment)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(query, [bookingId, userId, providerId, rating, comment], (err, result) => {
            if (err) return callback(err);
            
            // Update provider's average rating
            this.updateProviderRating(providerId, (err) => {
                if (err) return callback(err);
                callback(null, result);
            });
        });
    }

    // Update provider's average rating
    static updateProviderRating(providerId, callback) {
        const query = `
            UPDATE providers
            SET rating = (SELECT AVG(rating) FROM reviews WHERE provider_id = ?)
            WHERE id = ?
        `;
        db.query(query, [providerId, providerId], callback);
    }

    // Get all reviews (admin)
    static getAll(callback) {
        const query = `
            SELECT r.*, u.name as reviewer_name, p.name as provider_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN providers p ON r.provider_id = p.id
            ORDER BY r.created_at DESC
        `;
        db.query(query, callback);
    }

    // Mark review as helpful
    static markHelpful(reviewId, callback) {
        const query = `
            UPDATE reviews
            SET helpful_count = helpful_count + 1
            WHERE id = ?
        `;
        db.query(query, [reviewId], callback);
    }
}

module.exports = Review;
