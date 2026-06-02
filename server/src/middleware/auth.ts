// ============================================================
// JWT Authentication Middleware
// ============================================================
// Verifies the access token from the Authorization header.
// Full implementation in Phase 2.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../shared/errors';

/**
 * Authenticate request using JWT access token.
 * Expects: Authorization: Bearer <token>
 * Sets: req.user = { id, email, role }
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Access token is required');
  }

  // TODO: Phase 2 — Verify JWT and extract user payload
  // const token = authHeader.split(' ')[1];
  // const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  // req.user = { id: payload.sub, email: payload.email, role: payload.role };

  next();
}
