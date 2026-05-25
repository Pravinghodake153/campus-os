// ============================================================
// CampusOS AI — Auth Routes
// ============================================================

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { loginSchema } from '@campusos/validation';
import * as authController from './auth.controller.js';

const router = Router();

// POST /api/auth/login — Login with email and password
router.post('/login', validate(loginSchema), authController.login);

// GET /api/auth/me — Get current user profile (requires auth)
router.get('/me', authMiddleware, authController.me);

export default router;
