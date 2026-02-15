import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import {
  validateReview,
  validateIdParam,
  handleValidationErrors,
} from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create review (authenticated)
router.post(
  '/',
  authenticateToken,
  validateReview,
  handleValidationErrors,
  reviewController.createReview
);

// Get reviews for a tour (public)
router.get('/tour/:tourId', reviewController.getTourReviews);

// Get review by ID (public)
router.get('/:id', validateIdParam, handleValidationErrors, reviewController.getReviewById);

// Get user's reviews (authenticated)
router.get('/user/my-reviews', authenticateToken, reviewController.getUserReviews);

// Update review (authenticated)
router.put(
  '/:id',
  validateIdParam,
  handleValidationErrors,
  authenticateToken,
  reviewController.updateReview
);

// Delete review (authenticated)
router.delete(
  '/:id',
  validateIdParam,
  handleValidationErrors,
  authenticateToken,
  reviewController.deleteReview
);

export default router;
