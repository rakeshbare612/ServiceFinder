const Review = require('../models/Review');

// Get reviews for a provider
exports.getProviderReviews = (req, res) => {
    const { providerId } = req.params;

    Review.getProviderReviews(providerId, (err, reviews) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error fetching reviews' });
        }

        res.json({
            success: true,
            reviews: reviews || [],
            count: reviews ? reviews.length : 0
        });
    });
};

// Submit a review
exports.submitReview = (req, res) => {
    const { bookingId, providerId, rating, comment } = req.body;
    const userId = req.userId || req.body.userId; // Assuming middleware sets userId

    // Validation
    if (!bookingId || !providerId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Invalid review data' });
    }

    // Check if review already exists for this booking
    Review.getByBooking(bookingId, (err, existing) => {
        if (existing && existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Review already submitted for this booking' });
        }

        Review.create(bookingId, userId, providerId, rating, comment || '', (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error submitting review' });
            }

            res.json({
                success: true,
                message: 'Review submitted successfully',
                reviewId: result.insertId
            });
        });
    });
};

// Get all reviews (admin)
exports.getAllReviews = (req, res) => {
    Review.getAll((err, reviews) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error fetching reviews' });
        }

        res.json({
            success: true,
            reviews: reviews || [],
            count: reviews ? reviews.length : 0
        });
    });
};

// Mark review as helpful
exports.markHelpful = (req, res) => {
    const { reviewId } = req.params;

    Review.markHelpful(reviewId, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error marking review' });
        }

        res.json({
            success: true,
            message: 'Review marked as helpful'
        });
    });
};
