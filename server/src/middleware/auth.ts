// ============================================================
// JWT Authentication Middleware
// ============================================================
// Verifies the access token from the Authorization header.
// Sets req.user = { id, email, role } on success.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../shared/errors';
import { verifyAccessToken } from '../modules/auth/auth.service';

/**
 * Authenticate request using JWT access token.
 * Expects: Authorization: Bearer <token>
 * Sets: req.user = { id, email, role }
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is required');
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    if (!token) {
      throw new UnauthorizedError('Access token is required');
    }

    const payload = verifyAccessToken(token);

    // Attach user to request
    req.user = {
      id:    payload.sub,
      email: payload.email,
      role:  payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication — does not throw if no token present.
 * Use for routes that work both authenticated and unauthenticated.
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continue without user
  }

  try {
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    req.user = {
      id:    payload.sub,
      email: payload.email,
      role:  payload.role,
    };
  } catch {
    // Silently ignore invalid tokens for optional auth
  }

  next();
}
