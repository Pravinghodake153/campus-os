// ============================================================
// CampusOS AI — Dashboard Routes
// ============================================================

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { enforceBranchAccess } from '../../middleware/branch.middleware.js';
import * as dashboardController from './dashboard.controller.js';

const router = Router();

// GET /api/admin/dashboard — Admin dashboard metrics
router.get(
  '/dashboard',
  authMiddleware,
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN', 'HOD'),
  enforceBranchAccess(),
  dashboardController.getDashboard
);

export default router;
