// ============================================================
// CampusOS AI — Branch-Based Access Filtering Middleware
// Enforces campus/branch scope based on user role
// ============================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Sets req.accessFilter based on the user's role scope:
 *
 * SUPER_ADMIN          → no filter (sees all campuses, all branches)
 * CAMPUS_ADMIN         → filter by campusId only
 * PLACEMENT_OFFICER    → filter by campusId only
 * HOSTEL_MANAGER       → filter by campusId only
 * TRANSPORT_MANAGER    → filter by campusId only
 * HOD                  → filter by campusId + branchId
 * FACULTY              → filter by campusId + branchId
 * STUDENT              → filter by campusId + branchId (own data enforced in service layer)
 *
 * Must be used AFTER authMiddleware.
 */
export function enforceBranchAccess() {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { role, campusId, branchId } = req.user;

    // Build access filter based on role
    switch (role) {
      case 'SUPER_ADMIN':
        // National scope — no filtering
        req.accessFilter = {};
        break;

      case 'CAMPUS_ADMIN':
      case 'PLACEMENT_OFFICER':
      case 'HOSTEL_MANAGER':
      case 'TRANSPORT_MANAGER':
        // Campus scope — filter by campus only
        if (!campusId) {
          res.status(403).json({
            success: false,
            message: 'User is not assigned to any campus.',
            timestamp: new Date().toISOString(),
          });
          return;
        }
        req.accessFilter = { campusId };
        break;

      case 'HOD':
      case 'FACULTY':
      case 'STUDENT':
        // Branch scope — filter by campus + branch
        if (!campusId || !branchId) {
          res.status(403).json({
            success: false,
            message: 'User is not assigned to a campus and branch.',
            timestamp: new Date().toISOString(),
          });
          return;
        }
        req.accessFilter = { campusId, branchId };
        break;

      default:
        res.status(403).json({
          success: false,
          message: `Unknown role: ${role}`,
          timestamp: new Date().toISOString(),
        });
        return;
    }

    next();
  };
}
