import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createBlock,
  updateBlock,
  deleteBlock,
  createUnit,
  batchCreateUnits,
  updateUnit,
  deleteUnit,
} from '../controllers/project.controller.js';
import {
  validateCreateProject,
  validateUpdateProject,
  validateCreateBlock,
  validateCreateUnit,
  validateBatchCreateUnits,
  validateUpdateUnit,
} from '../middleware/projectValidation.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   GET /api/v1/projects
 * @desc    Get all construction projects (PUBLIC)
 */
router.get('/', getAllProjects);

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get single construction project by ID (PUBLIC)
 */
router.get('/:id', getProjectById);

/**
 * @route   POST /api/v1/projects
 * @desc    Create new construction project (PROTECTED: Admin Only)
 */
router.post('/', authenticateToken, requireAdmin, validateCreateProject, createProject);

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update construction project by ID (PROTECTED: Admin Only)
 */
router.put('/:id', authenticateToken, requireAdmin, validateUpdateProject, updateProject);

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete construction project by ID (PROTECTED: Admin Only)
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteProject);

// --- PROJECT BLOCK ROUTES (PROTECTED: Admin Only) ---

router.post('/:projectId/blocks', authenticateToken, requireAdmin, validateCreateBlock, createBlock);
router.put('/:projectId/blocks/:blockId', authenticateToken, requireAdmin, updateBlock);
router.delete('/:projectId/blocks/:blockId', authenticateToken, requireAdmin, deleteBlock);

// --- PROJECT UNIT / FLAT ROUTES (PROTECTED: Admin Only) ---

router.post('/:projectId/units/batch', authenticateToken, requireAdmin, validateBatchCreateUnits, batchCreateUnits);
router.post('/:projectId/units', authenticateToken, requireAdmin, validateCreateUnit, createUnit);
router.put('/:projectId/units/:unitId', authenticateToken, requireAdmin, validateUpdateUnit, updateUnit);
router.delete('/:projectId/units/:unitId', authenticateToken, requireAdmin, deleteUnit);

export default router;
