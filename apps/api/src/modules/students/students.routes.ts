// ============================================================
// CampusOS AI — Students Routes
// ============================================================

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { enforceBranchAccess } from '../../middleware/branch.middleware.js';
import * as studentsController from './students.controller.js';

const router = Router();

// GET /api/students — List students (filtered by access scope)
router.get(
  '/',
  authMiddleware,
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN', 'HOD', 'FACULTY'),
  enforceBranchAccess(),
  studentsController.getStudents
);

// GET /api/students/me/marks — Get marks for logged-in student
router.get(
  '/me/marks',
  authMiddleware,
  requireRole('STUDENT'),
  studentsController.getMyMarks
);

// POST /api/students — Create a new student
router.post(
  '/',
  authMiddleware,
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN'),
  studentsController.createStudent
);

export default router;
