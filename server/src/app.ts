// ============================================================
// Express Application Setup
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './config/cors';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';
import { router } from './routes';

const app = express();

// ============================================================
// Security Middleware
// ============================================================
app.use(helmet());
app.use(cors(corsOptions));

// ============================================================
// Body Parsing
// ============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// Logging
// ============================================================
app.use(requestLogger);

// ============================================================
// Rate Limiting
// ============================================================
app.use(env.API_PREFIX, apiLimiter);

// ============================================================
// Routes
// ============================================================
app.use(env.API_PREFIX, router);

// ============================================================
// Error Handling (must be last)
// ============================================================
app.use(errorHandler);

export default app;
