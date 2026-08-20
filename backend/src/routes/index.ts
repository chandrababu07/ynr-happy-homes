import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import equipmentRoutes from './equipment.routes.js';
import propertyRoutes from './property.routes.js';
import projectRoutes from './project.routes.js';
import enquiryRoutes from './enquiry.routes.js';
import mediaRoutes from './media.routes.js';

const router = Router();

// Mount API Sub-Routers
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/properties', propertyRoutes);
router.use('/projects', projectRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/media', mediaRoutes);

export default router;
