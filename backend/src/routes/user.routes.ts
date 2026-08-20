import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import {
  validateCreateUser,
  validateUpdateUser,
} from '../middleware/userValidation.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Protect ALL User Management routes with Admin authentication & authorization
router.use(authenticateToken, requireAdmin);

/**
 * @route   GET /api/v1/users
 * @desc    Get all registered users directory (ADMIN ONLY)
 */
router.get('/', getAllUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user details by ID (ADMIN ONLY)
 */
router.get('/:id', getUserById);

/**
 * @route   POST /api/v1/users
 * @desc    Create new user record (ADMIN ONLY)
 */
router.post('/', validateCreateUser, createUser);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user profile, role, or active status (ADMIN ONLY)
 */
router.put('/:id', validateUpdateUser, updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user record by ID (ADMIN ONLY)
 */
router.delete('/:id', deleteUser);

export default router;
