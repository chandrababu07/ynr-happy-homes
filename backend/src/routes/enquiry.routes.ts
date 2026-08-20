import { Router } from 'express';
import {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
} from '../controllers/enquiry.controller.js';
import {
  validateCreateEnquiry,
  validateUpdateEnquiry,
} from '../middleware/enquiryValidation.js';
import { enquiryRateLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   GET /api/v1/enquiries
 * @desc    Get all customer enquiries (PROTECTED: Admin Lead Inbox)
 */
router.get('/', authenticateToken, requireAdmin, getAllEnquiries);

/**
 * @route   GET /api/v1/enquiries/:id
 * @desc    Get single customer enquiry by ID (PROTECTED: Admin Only)
 */
router.get('/:id', authenticateToken, requireAdmin, getEnquiryById);

/**
 * @route   POST /api/v1/enquiries
 * @desc    Submit new customer enquiry (PUBLIC: Customer Submissions with Rate Limiting)
 */
router.post('/', enquiryRateLimiter, validateCreateEnquiry, createEnquiry);

/**
 * @route   PUT /api/v1/enquiries/:id
 * @desc    Update customer enquiry status or details by ID (PROTECTED: Admin Only)
 */
router.put('/:id', authenticateToken, requireAdmin, validateUpdateEnquiry, updateEnquiry);

/**
 * @route   DELETE /api/v1/enquiries/:id
 * @desc    Delete customer enquiry by ID (PROTECTED: Admin Only)
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteEnquiry);

export default router;
