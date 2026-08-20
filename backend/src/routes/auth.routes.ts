import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller.js';
import { validateLogin } from '../middleware/authValidation.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & issue JWT token
 */
router.post('/login', validateLogin, login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get authenticated user profile
 */
router.get('/me', authenticateToken, getMe);

export default router;
