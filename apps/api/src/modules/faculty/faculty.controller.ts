// ============================================================
// CampusOS AI — Faculty Controller
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../../utils/response.js';
import * as facultyService from './faculty.service.js';

/**
 * GET /api/faculty/classes
 * Get the classes (subjects) assigned to the logged-in faculty
 */
export async function getClasses(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    const classes = await facultyService.getFacultyClasses(req.user.id);

    if (classes === null) {
      sendError(res, 'Faculty profile not found for this user.', 404);
      return;
    }

    sendSuccess(res, classes, 'Faculty classes retrieved');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/faculty
 * Get all faculty (for Super Admin / Campus Admin)
 */
export async function getAllFaculty(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { campusId } = req.query;
    const filter = campusId ? { campusId: String(campusId) } : {};

    const faculty = await facultyService.getAllFaculty(filter);
    sendSuccess(res, faculty, 'Faculty retrieved');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/faculty
 * Add a new faculty
 */
export async function createFaculty(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const faculty = await facultyService.createFaculty(req.body);
    sendSuccess(res, faculty, 'Faculty created successfully', 201);
  } catch (error) {
    next(error);
  }
}
