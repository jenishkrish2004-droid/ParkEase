// ============================================================
// Role-Based Authorization Middleware
// ============================================================
// Checks if the authenticated user has the required role.
// Must be used AFTER the authenticate middleware.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@parkora/shared';
import { ForbiddenError, UnauthorizedError } from '../shared/errors';

/**
 * Authorize request based on user role.
 * @param roles - Allowed roles for this route
 */
export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('You do not have permission to access this resource');
    }

    next();
  };
}
