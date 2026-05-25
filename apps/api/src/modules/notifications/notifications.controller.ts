// ============================================================
// CampusOS AI — Notifications Controller
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../../utils/response.js';
import * as notificationsService from './notifications.service.js';

/**
 * GET /api/notifications
 */
export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const data = await notificationsService.getNotifications(req.user.id, limit);
    sendSuccess(res, data, 'Notifications retrieved');
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/notifications/:id/read
 */
export async function markAsRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    await notificationsService.markAsRead(req.params.id as string, req.user.id);
    sendSuccess(res, null, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/notifications
 */
export async function createNotification(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const notification = await notificationsService.createNotification(req.body);
    sendSuccess(res, notification, 'Notification sent successfully', 201);
  } catch (error) {
    next(error);
  }
}
