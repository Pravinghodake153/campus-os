// ============================================================
// CampusOS AI — Notifications Routes
// ============================================================

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import * as notificationsController from './notifications.controller.js';

const router = Router();

// GET /api/notifications — List notifications for current user
router.get('/', authMiddleware, notificationsController.getNotifications);

// PATCH /api/notifications/:id/read — Mark notification as read
router.patch('/:id/read', authMiddleware, notificationsController.markAsRead);

import { requireRole } from '../../middleware/role.middleware.js';

// POST /api/notifications — Broadcast/send notification
router.post(
  '/',
  authMiddleware,
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN', 'HOD'),
  notificationsController.createNotification
);

export default router;
