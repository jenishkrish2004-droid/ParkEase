// ============================================================
// Auth Module — Types
// ============================================================

import { UserRole } from '@parkora/shared';

/** JWT Access Token payload */
export interface JwtAccessPayload {
  sub: string;      // userId
  email: string;
  role: UserRole;
  isOwner: boolean;
  ownerVerified: boolean;
  iat?: number;
  exp?: number;
}

/** JWT Refresh Token payload */
export interface JwtRefreshPayload {
  sub: string;      // userId
  family: string;   // token rotation family
  jti: string;      // unique token ID
  iat?: number;
  exp?: number;
}

/** Token pair returned on login/register/refresh */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until access token expires
}

/** Authenticated user data attached to req.user */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  isOwner: boolean;
  ownerVerified: boolean;
}
