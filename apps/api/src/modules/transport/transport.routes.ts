import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import * as controller from './transport.controller.js';

const router = Router();

router.use(authMiddleware);

// Get all transport routes
router.get('/', controller.getRoutes);

// Add a new transport route (Super Admin, Campus Admin, Transport Manager)
router.post(
  '/',
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN', 'TRANSPORT_MANAGER'),
  controller.createRoute
);

export default router;
