// ============================================================
// CampusOS AI — Request Validation Middleware
// Validates request body against Zod schemas
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Factory function that creates middleware to validate req.body against a Zod schema.
 * On success, replaces req.body with parsed (cleaned) data.
 * On failure, returns 400 with field-level validation errors.
 *
 * Usage: validate(loginSchema)
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        for (const issue of error.issues) {
          const path = issue.path.join('.') || 'body';
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
      next(error);
    }
  };
}
