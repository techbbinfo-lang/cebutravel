import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import {
  validateBooking,
  validateIdParam,
  handleValidationErrors,
} from '../middleware/validation.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// User bookings
router.post(
  '/',
  authenticateToken,
  validateBooking,
  handleValidationErrors,
  bookingController.createBooking
);

router.get('/', authenticateToken, bookingController.getUserBookings);
router.get('/details/:id', validateIdParam, handleValidationErrors, authenticateToken, bookingController.getBookingById);

router.put(
  '/:id/status',
  validateIdParam,
  handleValidationErrors,
  authenticateToken,
  bookingController.updateBookingStatus
);

router.post(
  '/:id/cancel',
  validateIdParam,
  handleValidationErrors,
  authenticateToken,
  bookingController.cancelBooking
);

// Admin bookings
router.get(
  '/admin/all',
  authenticateToken,
  authorizeRole(['admin']),
  bookingController.getAllBookings
);

router.delete(
  '/:id',
  validateIdParam,
  handleValidationErrors,
  authenticateToken,
  authorizeRole(['admin']),
  bookingController.deleteBooking
);

export default router;
