// ============================================================
// Auth Module — Routes
// ============================================================

import { Router } from 'express';
import { authLimiter } from '../../middleware/rateLimiter';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyRegistrationSchema,
} from './auth.schema';
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  logoutAllHandler,
  getMeHandler,
  verifyRegistrationHandler,
} from './auth.controller';

const router = Router();

// ── Public Routes (rate limited) ─────────────────────────────

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  registerHandler,
);

/**
 * @route   POST /api/v1/auth/verify-registration
 * @desc    Verify OTP sent during registration and get token pair
 * @access  Public
 */
router.post(
  '/verify-registration',
  authLimiter,
  validate(verifyRegistrationSchema),
  verifyRegistrationHandler,
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get token pair
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  loginHandler,
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using a valid refresh token
 * @access  Public (uses refresh token)
 */
router.post(
  '/refresh',
  authLimiter,
  validate(refreshTokenSchema),
  refreshHandler,
);

// ── Protected Routes (require valid access token) ─────────────

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get authenticated user's profile
 * @access  Protected
 */
router.get('/me', authenticate, getMeHandler);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout current device (revoke specific refresh token)
 * @access  Protected
 */
router.post('/logout', authenticate, logoutHandler);

/**
 * @route   POST /api/v1/auth/logout-all
 * @desc    Logout from all devices (revoke all refresh tokens)
 * @access  Protected
 */
router.post('/logout-all', authenticate, logoutAllHandler);

export { router as authRouter };
