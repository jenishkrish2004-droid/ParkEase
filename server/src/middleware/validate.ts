// ============================================================
// Request Validation Middleware
// ============================================================
// Validates request body/query/params against a Zod schema.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../shared/errors';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Validate a request using a Zod schema.
 * @param schema - Zod schema to validate against
 * @param target - Which part of the request to validate (default: 'body')
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[target]);
      // Replace with parsed data (includes defaults, coercions, transforms)
      req[target] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new ValidationError('Validation failed', details);
      }
      throw error;
    }
  };
}
