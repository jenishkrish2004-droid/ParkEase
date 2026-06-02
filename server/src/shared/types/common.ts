// ============================================================
// Common Types
// ============================================================

import { Request, Response, NextFunction } from 'express';

/** Async request handler that catches errors automatically */
export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/** Wraps an async handler to catch errors and forward them to error middleware */
export function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
