import { Router } from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '../controllers/equipment.controller.js';
import {
  validateCreateEquipment,
  validateUpdateEquipment,
} from '../middleware/equipmentValidation.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   GET /api/v1/equipment
 * @desc    Get all equipment records (PUBLIC)
 */
router.get('/', getAllEquipment);

/**
 * @route   GET /api/v1/equipment/:id
 * @desc    Get single equipment record by ID (PUBLIC)
 */
router.get('/:id', getEquipmentById);

/**
 * @route   POST /api/v1/equipment
 * @desc    Create new equipment record (PROTECTED: Admin Only)
 */
router.post('/', authenticateToken, requireAdmin, validateCreateEquipment, createEquipment);

/**
 * @route   PUT /api/v1/equipment/:id
 * @desc    Update existing equipment record by ID (PROTECTED: Admin Only)
 */
router.put('/:id', authenticateToken, requireAdmin, validateUpdateEquipment, updateEquipment);

/**
 * @route   DELETE /api/v1/equipment/:id
 * @desc    Delete equipment record by ID (PROTECTED: Admin Only)
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteEquipment);

export default router;
