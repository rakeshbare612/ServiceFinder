const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Get reviews for a provider
router.get('/provider/:providerId', reviewController.getProviderReviews);

// Submit a review
router.post('/submit', reviewController.submitReview);

// Get all reviews (admin)
router.get('/all', reviewController.getAllReviews);

// Mark review as helpful
router.put('/:reviewId/helpful', reviewController.markHelpful);

module.exports = router;
