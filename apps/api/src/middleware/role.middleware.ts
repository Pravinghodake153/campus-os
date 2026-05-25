// ============================================================
// CampusOS AI — Role-Based Access Control Middleware
// Restricts access to specific user roles
// ============================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Factory function that creates middleware to restrict access to specific roles.
 * Must be used AFTER authMiddleware.
 *
 * Usage: requireRole('SUPER_ADMIN', 'CAMPUS_ADMIN', 'HOD')
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${req.user.role}.`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
}
