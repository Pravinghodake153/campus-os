// ============================================================
// CampusOS AI — Attendance Routes
// ============================================================

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { enforceBranchAccess } from '../../middleware/branch.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import * as attendanceController from './attendance.controller.js';

const router = Router();

// GET /api/attendance/summary — Role-aware attendance summary
router.get(
  '/summary',
  authMiddleware,
  enforceBranchAccess(),
  attendanceController.getSummary
);

// POST /api/attendance/sessions — Faculty creates attendance session
router.post(
  '/sessions',
  authMiddleware,
  requireRole('FACULTY', 'HOD'),
  attendanceController.createSession
);

// POST /api/attendance/sessions/:id/mark — Student marks attendance
router.post(
  '/sessions/:id/mark',
  authMiddleware,
  requireRole('STUDENT'),
  attendanceController.markAttendance
);

// GET /api/attendance/sessions/:id/records — Get live session records
router.get(
  '/sessions/:id/records',
  authMiddleware,
  attendanceController.getSessionRecords
);

// PATCH /api/attendance/sessions/:id/end — Faculty ends session
router.patch(
  '/sessions/:id/end',
  authMiddleware,
  requireRole('FACULTY', 'HOD'),
  attendanceController.endSession
);

export default router;
