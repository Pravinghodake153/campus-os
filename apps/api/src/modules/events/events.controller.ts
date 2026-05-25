// ============================================================
// CampusOS AI — Events Controller
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../../utils/response.js';
import * as eventsService from './events.service.js';

/**
 * GET /api/events
 */
export async function getEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filter = {
      campusId: req.user?.campusId || undefined,
    };
    const events = await eventsService.getEvents(filter);
    sendSuccess(res, events, 'Events retrieved');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/events/:id/register
 */
export async function registerForEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    if (req.user.role !== 'STUDENT') {
      sendError(res, 'Only students can register for events.', 403);
      return;
    }

    const studentId = await eventsService.getStudentIdFromUserId(req.user.id);
    if (!studentId) {
      sendError(res, 'Student profile not found.', 404);
      return;
    }

    const result = await eventsService.registerForEvent(req.params.id as string, studentId);

    if (result.alreadyRegistered) {
      sendSuccess(res, result, 'Already registered for this event');
    } else {
      sendSuccess(res, result, 'Successfully registered for event', 201);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Event not found') {
        sendError(res, 'Event not found.', 404);
        return;
      }
      if (error.message === 'Event is full') {
        sendError(res, 'Event has reached maximum capacity.', 409);
        return;
      }
    }
    next(error);
  }
}

/**
 * POST /api/events
 */
export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const event = await eventsService.createEvent(req.body);
    sendSuccess(res, event, 'Event created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/events/:id
 */
export async function deleteEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await eventsService.deleteEvent(req.params.id);
    sendSuccess(res, null, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
}
