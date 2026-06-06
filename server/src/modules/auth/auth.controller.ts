// ============================================================
// Auth Module — Controller
// ============================================================
// Handles HTTP request/response.
// Delegates all business logic to auth.service.ts.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import type { RegisterInput, LoginInput, RefreshTokenInput } from './auth.schema';

// Helper to extract client info from request
function getClientInfo(req: Request) {
  return {
    userAgent: req.headers['user-agent'],
    ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip,
  };
}

// ── POST /auth/register ──────────────────────────────────────
export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = req.body as RegisterInput;
    const { userAgent, ipAddress } = getClientInfo(req);

    const { user, tokens } = await authService.register(input, userAgent, ipAddress);

    sendCreated(res, {
      user,
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
}

// ── POST /auth/login ─────────────────────────────────────────
export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = req.body as LoginInput;
    const { userAgent, ipAddress } = getClientInfo(req);

    const { user, tokens } = await authService.login(input, userAgent, ipAddress);

    sendSuccess(res, {
      user,
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
}

// ── POST /auth/refresh ───────────────────────────────────────
export async function refreshHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { refreshToken } = req.body as RefreshTokenInput;
    const { userAgent, ipAddress } = getClientInfo(req);

    const tokens = await authService.refreshTokens(refreshToken, userAgent, ipAddress);

    sendSuccess(res, tokens);
  } catch (error) {
    next(error);
  }
}

// ── POST /auth/logout ────────────────────────────────────────
export async function logoutHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { refreshToken } = req.body as Partial<RefreshTokenInput>;

    await authService.logout(userId, refreshToken);

    sendSuccess(res, { message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

// ── POST /auth/logout-all ────────────────────────────────────
export async function logoutAllHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;

    await authService.logout(userId); // No refreshToken = logout all

    sendSuccess(res, { message: 'Logged out from all devices successfully' });
  } catch (error) {
    next(error);
  }
}

// ── GET /auth/me ─────────────────────────────────────────────
export async function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const user = await authService.getMe(userId);
    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
}
