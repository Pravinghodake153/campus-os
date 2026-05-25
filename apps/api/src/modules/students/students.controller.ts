// ============================================================
// CampusOS AI — Students Controller
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { sendPaginated, sendSuccess, sendError } from '../../utils/response.js';
import * as studentsService from './students.service.js';

/**
 * GET /api/students
 * List students with filtering, pagination, and search
 */
export async function getStudents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = {
      branchId: req.query.branchId as string | undefined,
      semester: req.query.semester ? parseInt(req.query.semester as string) : undefined,
      section: req.query.section as string | undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };

    const result = await studentsService.getStudents(
      req.accessFilter || {},
      query
    );

    sendPaginated(
      res,
      result.data,
      result.total,
      result.page,
      result.limit,
      'Students retrieved'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/students/me/marks
 * Get marks and risk prediction for the logged-in student
 */
export async function getMyMarks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    const data = await studentsService.getStudentMarks(req.user.id);

    if (!data) {
      sendError(res, 'Student profile not found.', 404);
      return;
    }

    sendSuccess(res, data, 'Student marks retrieved');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/students
 * Create a new student
 */
export async function createStudent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const student = await studentsService.createStudent(req.body);
    sendSuccess(res, student, 'Student created successfully', 201);
  } catch (error) {
    next(error);
  }
}
