// ============================================================
// CampusOS AI — Faculty Routes
// ============================================================

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import * as facultyController from './faculty.controller.js';

const router = Router();

// GET /api/faculty/classes — Get assigned classes (faculty only)
router.get(
  '/classes',
  authMiddleware,
  requireRole('FACULTY', 'HOD'),
  facultyController.getClasses
);

// GET /api/faculty — Get all faculty
router.get(
  '/',
  authMiddleware,
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN', 'HOD'),
  facultyController.getAllFaculty
);

// POST /api/faculty — Add new faculty
router.post(
  '/',
  authMiddleware,
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN'),
  facultyController.createFaculty
);

export default router;
