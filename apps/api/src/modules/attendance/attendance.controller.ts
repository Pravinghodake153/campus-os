// ============================================================
// CampusOS AI — Attendance Controller
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../../utils/response.js';
import * as attendanceService from './attendance.service.js';

/**
 * GET /api/attendance/summary
 * Get attendance summary based on user role
 */
export async function getSummary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    const summary = await attendanceService.getAttendanceSummary(
      req.accessFilter || {},
      req.user.role,
      req.user.id
    );

    if (summary === null) {
      sendError(res, 'Profile not found.', 404);
      return;
    }

    sendSuccess(res, summary, 'Attendance summary retrieved');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/attendance/sessions
 * Faculty starts a new attendance session
 */
export async function createSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    const { subjectId } = req.body;
    if (!subjectId) {
      sendError(res, 'subjectId is required.', 400);
      return;
    }

    const result = await attendanceService.createSession(req.user.id, subjectId);

    if (!result) {
      sendError(res, 'Faculty profile not found or subject not assigned.', 404);
      return;
    }

    if (result.alreadyActive) {
      sendSuccess(res, result.session, 'Session already active');
    } else {
      sendSuccess(res, result.session, 'Attendance session started', 201);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/attendance/sessions/:id/mark
 * Student marks their attendance
 */
export async function markAttendance(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    const result = await attendanceService.markAttendance(req.user.id, req.params.id as string);

    if ('error' in result) {
      sendError(res, result.error as string, (result.code as number) || 400);
      return;
    }

    sendSuccess(res, result, 'Attendance marked');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/attendance/sessions/:id/records
 * Get live records for a session
 */
export async function getSessionRecords(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const records = await attendanceService.getSessionRecords(req.params.id as string);
    sendSuccess(res, records, 'Session records retrieved');
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/attendance/sessions/:id/end
 * Faculty ends the session
 */
export async function endSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    const result = await attendanceService.endSession(req.user.id, req.params.id as string);

    if (!result) {
      sendError(res, 'Session not found or not authorized.', 404);
      return;
    }

    sendSuccess(res, result, 'Session ended');
  } catch (error) {
    next(error);
  }
}
