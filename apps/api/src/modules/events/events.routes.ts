// ============================================================
// CampusOS AI — Events Routes
// ============================================================

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import * as eventsController from './events.controller.js';

const router = Router();

// GET /api/events — List active events
router.get('/', authMiddleware, eventsController.getEvents);

// POST /api/events/:id/register — Register for an event (students only)
router.post('/:id/register', authMiddleware, eventsController.registerForEvent);

import { requireRole } from '../../middleware/role.middleware.js';

// POST /api/events — Create an event (Admin)
router.post(
  '/',
  authMiddleware,
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN'),
  eventsController.createEvent
);

// DELETE /api/events/:id — Delete an event (Admin)
router.delete(
  '/:id',
  authMiddleware,
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN'),
  eventsController.deleteEvent
);

export default router;
