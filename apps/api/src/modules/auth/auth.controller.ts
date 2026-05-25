// ============================================================
// CampusOS AI — Auth Controller
// HTTP handlers for authentication endpoints
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../../utils/response.js';
import { logAudit } from '../../utils/audit.js';
import * as authService from './auth.service.js';

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await authService.findUserByEmail(email);
    if (!user) {
      sendError(res, 'Invalid email or password.', 401);
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      sendError(res, 'Account is deactivated. Please contact administrator.', 403);
      return;
    }

    // Verify password
    const isValid = await authService.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      sendError(res, 'Invalid email or password.', 401);
      return;
    }

    // Generate JWT
    const token = authService.generateToken({
      id: user.id,
      role: user.role,
      campusId: user.campusId,
      branchId: user.branchId,
    });

    // Log audit
    await logAudit(user.id, 'LOGIN', 'user', user.id, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
        branchId: user.branchId,
        campusName: user.campus?.name ?? null,
        branchName: user.branch?.name ?? null,
        isActive: user.isActive,
      },
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Get current authenticated user's profile
 */
export async function me(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    const user = await authService.findUserById(req.user.id);
    if (!user) {
      sendError(res, 'User not found.', 404);
      return;
    }

    sendSuccess(res, user, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
}
