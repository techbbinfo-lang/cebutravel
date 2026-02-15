import { Review } from '../models/Review.js';
import { Tour } from '../models/Tour.js';

export const createReview = async (req, res) => {
  try {
    const { tourId, rating, comment } = req.body;

    // Verify tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.hasReviewed(tourId, req.user.id);
    if (existingReview) {
      return res.status(409).json({ error: 'You have already reviewed this tour' });
    }

    const newReview = await Review.create({
      tourId,
      userId: req.user.id,
      rating: parseInt(rating),
      comment,
    });

    // Update tour rating
    const ratingInfo = await Review.calculateAverageRating(tourId);
    await Tour.updateRating(tourId, ratingInfo.averageRating, ratingInfo.count);

    res.status(201).json({
      message: 'Review created successfully',
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTourReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await Review.findByTourId(req.params.tourId, parseInt(page), parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await Review.findByUserId(req.user.id, parseInt(page), parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check authorization
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updateData = {};
    if (rating) updateData.rating = parseInt(rating);
    if (comment) updateData.comment = comment;

    const updatedReview = await Review.updateById(req.params.id, updateData);

    // Update tour rating if rating changed
    if (rating) {
      const ratingInfo = await Review.calculateAverageRating(review.tourId.toString());
      await Tour.updateRating(review.tourId.toString(), ratingInfo.averageRating, ratingInfo.count);
    }

    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check authorization
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const deleted = await Review.deleteById(req.params.id);
    if (!deleted) {
      return res.status(400).json({ error: 'Failed to delete review' });
    }

    // Update tour rating
    const ratingInfo = await Review.calculateAverageRating(review.tourId.toString());
    await Tour.updateRating(review.tourId.toString(), ratingInfo.averageRating, ratingInfo.count);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
