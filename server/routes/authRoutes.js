import express from 'express';
import { login, logout, getMe, getDashboardMetrics } from '../controllers/authController.js';
import {
  updateProfileName,
  requestPasswordChangeOTP,
  confirmPasswordChange,
  requestEmailChangeOTPs,
  confirmEmailChange,
} from '../controllers/profileController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// General Authentication
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', getMe);
router.get('/dashboard', authenticateAdmin, getDashboardMetrics);

// Profile Settings & Security Modifications
router.patch('/profile/name', authenticateAdmin, updateProfileName);
router.post('/profile/request-password-otp', authenticateAdmin, requestPasswordChangeOTP);
router.post('/profile/confirm-password', authenticateAdmin, confirmPasswordChange);
router.post('/profile/request-email-otp', authenticateAdmin, requestEmailChangeOTPs);
router.post('/profile/confirm-email', authenticateAdmin, confirmEmailChange);

export default router;
