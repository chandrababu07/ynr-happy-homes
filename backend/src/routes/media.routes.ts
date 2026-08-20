import { Router } from 'express';
import { uploadMedia, deleteMedia, getEntityMedia, reorderMedia } from '../controllers/media.controller.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   GET /api/v1/media/entity/:entityType/:entityId
 * @desc    Get media assets linked to a specific entity (PUBLIC)
 */
router.get('/entity/:entityType/:entityId', getEntityMedia);

/**
 * @route   POST /api/v1/media/upload
 * @desc    Upload new photograph or PDF brochure (ADMIN ONLY)
 */
router.post('/upload', authenticateToken, requireAdmin, upload.single('file'), uploadMedia);

/**
 * @route   DELETE /api/v1/media/:id
 * @desc    Delete media asset & clean up physical file (ADMIN ONLY)
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteMedia);

/**
 * @route   PUT /api/v1/media/reorder
 * @desc    Reorder media assets display sequence (ADMIN ONLY)
 */
router.put('/reorder', authenticateToken, requireAdmin, reorderMedia);

export default router;
