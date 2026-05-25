import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import * as controller from './hostel.controller.js';

const router = Router();

router.use(authMiddleware);

// Get all hostels
router.get('/', controller.getHostels);

// Add a new hostel (Super Admin, Campus Admin, Hostel Manager)
router.post(
  '/',
  requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN', 'HOSTEL_MANAGER'),
  controller.createHostel
);

// Get hostel complaints
router.get('/complaints', controller.getComplaints);

// Add a complaint (Students only, usually, but admins can create on behalf)
router.post('/complaints', controller.createComplaint);

export default router;
