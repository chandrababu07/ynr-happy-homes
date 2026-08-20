import { Router } from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/property.controller.js';
import {
  validateCreateProperty,
  validateUpdateProperty,
} from '../middleware/propertyValidation.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   GET /api/v1/properties
 * @desc    Get all property listings (PUBLIC)
 */
router.get('/', getAllProperties);

/**
 * @route   GET /api/v1/properties/:id
 * @desc    Get single property by ID (PUBLIC)
 */
router.get('/:id', getPropertyById);

/**
 * @route   POST /api/v1/properties
 * @desc    Create new property listing (PROTECTED: Admin Only)
 */
router.post('/', authenticateToken, requireAdmin, validateCreateProperty, createProperty);

/**
 * @route   PUT /api/v1/properties/:id
 * @desc    Update existing property listing by ID (PROTECTED: Admin Only)
 */
router.put('/:id', authenticateToken, requireAdmin, validateUpdateProperty, updateProperty);

/**
 * @route   DELETE /api/v1/properties/:id
 * @desc    Delete property listing by ID (PROTECTED: Admin Only)
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteProperty);

export default router;
