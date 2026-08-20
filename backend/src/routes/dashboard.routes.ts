import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Protect Dashboard Analytics with Admin authentication & authorization
router.use(authenticateToken, requireAdmin);

/**
 * @route   GET /api/v1/dashboard/summary
 * @desc    Get complete platform aggregate statistics & recent activity feed (ADMIN ONLY)
 */
router.get('/summary', getDashboardSummary);

export default router;
