// ============================================================
// CampusOS AI — Dashboard Controller
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response.js';
import * as dashboardService from './dashboard.service.js';

/**
 * GET /api/admin/dashboard
 * Get aggregated dashboard metrics (filtered by access scope)
 */
export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const metrics = await dashboardService.getDashboardMetrics(
      req.accessFilter || {}
    );
    sendSuccess(res, metrics, 'Dashboard metrics retrieved');
  } catch (error) {
    next(error);
  }
}
