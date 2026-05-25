// ============================================================
// CampusOS AI — Global Error Handler Middleware
// Catches all errors and returns consistent API responses
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { config } from '../config/index.js';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error in development
  if (config.isDev) {
    console.error('❌ Error:', err);
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    }

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[])?.join(', ') || 'field';
        res.status(409).json({
          success: false,
          message: `A record with this ${target} already exists.`,
          timestamp: new Date().toISOString(),
        });
        return;
      }
      case 'P2025':
        res.status(404).json({
          success: false,
          message: 'Record not found.',
          timestamp: new Date().toISOString(),
        });
        return;
      case 'P2003':
        res.status(400).json({
          success: false,
          message: 'Foreign key constraint failed. Related record not found.',
          timestamp: new Date().toISOString(),
        });
        return;
      default:
        res.status(400).json({
          success: false,
          message: `Database error: ${err.message}`,
          timestamp: new Date().toISOString(),
        });
        return;
    }
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: 'Invalid data provided to database query.',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Generic server error
  res.status(500).json({
    success: false,
    message: config.isDev ? err.message : 'Internal server error',
    timestamp: new Date().toISOString(),
  });
}
