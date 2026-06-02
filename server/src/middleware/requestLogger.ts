// ============================================================
// Request Logger Middleware
// ============================================================

import morgan from 'morgan';
import { env } from '../config/env';

/** HTTP request logger — 'dev' format in development, 'combined' in production */
export const requestLogger = morgan(
  env.NODE_ENV === 'production' ? 'combined' : 'dev',
);
