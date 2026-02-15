import { body, validationResult, param } from 'express-validator';

export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateTour = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('groupSize').isInt({ min: 1 }).withMessage('Group size must be at least 1'),
];

export const validateBooking = [
  body('tourId').isMongoId().withMessage('Invalid tour ID'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date'),
  body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
  body('totalPrice').isFloat({ min: 0 }).withMessage('Total price must be valid'),
];

export const validateReview = [
  body('tourId').isMongoId().withMessage('Invalid tour ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ min: 10 }).withMessage('Comment must be at least 10 characters'),
];

export const validateIdParam = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
