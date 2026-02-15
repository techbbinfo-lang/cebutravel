import express from 'express';
import * as tourController from '../controllers/tourController.js';
import {
  validateTour,
  validateIdParam,
  handleValidationErrors,
} from '../middleware/validation.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', tourController.getAllTours);
router.get('/featured', tourController.getFeaturedTours);
router.get('/stats/:id', tourController.getTourStats);
router.get('/:id', validateIdParam, handleValidationErrors, tourController.getTourById);

// Protected routes
router.post(
  '/',
  authenticateToken,
  authorizeRole(['admin']),
  validateTour,
  handleValidationErrors,
  tourController.createTour
);

router.put(
  '/:id',
  validateIdParam,
  handleValidationErrors,
  authenticateToken,
  tourController.updateTour
);

router.delete(
  '/:id',
  validateIdParam,
  handleValidationErrors,
  authenticateToken,
  tourController.deleteTour
);

export default router;
