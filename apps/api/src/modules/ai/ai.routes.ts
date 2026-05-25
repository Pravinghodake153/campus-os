// ============================================================
// CampusOS AI — AI Proxy Routes
// Routes all AI requests through Node.js for RBAC and data prep
// ============================================================

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { enforceBranchAccess } from '../../middleware/branch.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import * as aiController from './ai.controller.js';

const router = Router();

// --- Risk Prediction Endpoints ---
router.post(
  '/risk/batch',
  authMiddleware,
  enforceBranchAccess(),
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN', 'HOD'),
  aiController.predictRiskBatch
);

router.post(
  '/risk/train',
  authMiddleware,
  requireRole('SUPER_ADMIN'),
  aiController.retrainModel
);

router.get(
  '/risk/model-info',
  authMiddleware,
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN'),
  aiController.getModelInfo
);

// --- Timetable Optimizer Endpoints ---
router.post(
  '/timetable/generate',
  authMiddleware,
  enforceBranchAccess(),
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN', 'HOD'),
  aiController.generateTimetable
);

router.post(
  '/timetable/save',
  authMiddleware,
  enforceBranchAccess(),
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN', 'HOD'),
  aiController.saveTimetable
);

// --- AI Assistant Endpoints ---
router.post(
  '/assistant/query',
  authMiddleware,
  aiController.assistantQuery
);

export default router;
