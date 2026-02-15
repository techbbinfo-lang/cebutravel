import express from 'express';
import * as authController from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.get('/me', authenticateToken, authController.getCurrentUser);
router.put('/profile', authenticateToken, authController.updateProfile);
router.post('/change-password', authenticateToken, authController.changePassword);

export default router;
