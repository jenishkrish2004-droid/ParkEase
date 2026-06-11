// ============================================================
// Standardized API Response Builder
// ============================================================

import { Response } from 'express';
import type { IPaginationMeta } from '../../../../shared/src/types/api';

/** Send a success response */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: IPaginationMeta,
): void {
  res.status(statusCode).json({
    success: true,
    data,
    ...(meta && { meta }),
  });
}

/** Send a created response (201) */
export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

/** Send a no-content response (204) */
export function sendNoContent(res: Response): void {
  res.status(204).send();
}

/** Send an error response */
export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Array<{ field: string; message: string }>,
): void {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  });
}
