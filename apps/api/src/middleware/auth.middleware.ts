// ============================================================
// CampusOS AI — JWT Authentication Middleware
// Extracts and verifies JWT from Authorization header
// ============================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../config/prisma.js';

export interface AuthenticatedUser {
  id: string;
  role: string;
  campusId: string | null;
  branchId: string | null;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      accessFilter?: {
        campusId?: string;
        branchId?: string;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid Bearer token.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      role: string;
      campusId: string | null;
      branchId: string | null;
    };

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, campusId: true, branchId: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account is inactive or not found.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    req.user = {
      id: user.id,
      role: user.role,
      campusId: user.campusId,
      branchId: user.branchId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    next(error);
  }
}
