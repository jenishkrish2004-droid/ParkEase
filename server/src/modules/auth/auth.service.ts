// ============================================================
// Auth Module — Service Layer
// ============================================================
// Pure business logic: hashing, JWT, DB operations.
// No Express types (Request/Response) here.
// ============================================================

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { AppError, UnauthorizedError } from '../../shared/errors';
import type { RegisterInput, LoginInput } from './auth.schema';
import type { JwtAccessPayload, JwtRefreshPayload, TokenPair } from './auth.types';
import { UserRole } from '@parkease/shared';

// ── Constants ────────────────────────────────────────────────
const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ── Helpers ──────────────────────────────────────────────────

/** Parse JWT expiry string (e.g., "15m", "7d") to seconds */
function parseExpiryToSeconds(expiry: string): number {
  const unit = expiry.slice(-1);
  const value = parseInt(expiry.slice(0, -1), 10);
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default:  return 900; // 15 minutes fallback
  }
}

/** Hash a string using SHA-256 (for refresh token storage) */
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Generate a cryptographically random token string */
function generateOpaqueToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

// ── Token Generation ─────────────────────────────────────────

function signAccessToken(userId: string, email: string, role: UserRole): string {
  const payload: JwtAccessPayload = { sub: userId, email, role };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
    issuer: 'parkease',
    audience: 'parkease-client',
  } as jwt.SignOptions);
}

async function createRefreshToken(
  userId: string,
  family: string,
  userAgent?: string,
  ipAddress?: string,
): Promise<string> {
  const rawToken = generateOpaqueToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      family,
      expiresAt,
      userAgent: userAgent ?? null,
      ipAddress: ipAddress ?? null,
    },
  });

  return rawToken;
}

async function buildTokenPair(
  userId: string,
  email: string,
  role: UserRole,
  family: string,
  userAgent?: string,
  ipAddress?: string,
): Promise<TokenPair> {
  const accessToken  = signAccessToken(userId, email, role);
  const refreshToken = await createRefreshToken(userId, family, userAgent, ipAddress);
  const expiresIn    = parseExpiryToSeconds(env.JWT_ACCESS_EXPIRY);

  return { accessToken, refreshToken, expiresIn };
}

// ── Auth Service Methods ──────────────────────────────────────

/**
 * Register a new user.
 * Throws ConflictError if email already exists.
 */
export async function register(
  input: RegisterInput,
  userAgent?: string,
  ipAddress?: string,
) {
  // 1. Check for existing user
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existing) {
    throw new AppError('An account with this email already exists', 409, 'EMAIL_ALREADY_EXISTS');
  }

  // 2. Hash password
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  // 3. Create user
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role as UserRole,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      avatar: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // 4. Create token pair (new family for new login session)
  const family = crypto.randomUUID();
  const tokens = await buildTokenPair(user.id, user.email, user.role as UserRole, family, userAgent, ipAddress);

  return { user, tokens };
}

/**
 * Authenticate a user with email + password.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function login(
  input: LoginInput,
  userAgent?: string,
  ipAddress?: string,
) {
  // 1. Find user (always hash even if not found — prevents user enumeration)
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      passwordHash: true,
      role: true,
      status: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      avatar: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // 2. Validate credentials (constant-time to prevent timing attacks)
  const dummyHash = '$2b$12$invalid.hash.to.prevent.timing.attacks.xxxxxxxxxxxxxx';
  const hashToCompare = user?.passwordHash ?? dummyHash;
  const passwordValid = await bcrypt.compare(input.password, hashToCompare);

  if (!user || !passwordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // 3. Check account status
  if (user.status !== 'ACTIVE') {
    throw new AppError(
      'Your account has been suspended. Please contact support.',
      403,
      'ACCOUNT_SUSPENDED',
    );
  }

  // 4. Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // 5. Issue token pair
  const family = crypto.randomUUID();
  const tokens = await buildTokenPair(user.id, user.email, user.role as UserRole, family, userAgent, ipAddress);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...safeUser } = user;
  return { user: safeUser, tokens };
}

/**
 * Refresh access token using a valid refresh token.
 * Implements token rotation with family-based reuse detection.
 */
export async function refreshTokens(
  rawRefreshToken: string,
  userAgent?: string,
  ipAddress?: string,
): Promise<TokenPair> {
  const tokenHash = hashToken(rawRefreshToken);

  // 1. Find the token in DB
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (!stored) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  // 2. Check if already revoked — possible reuse attack
  if (stored.revokedAt !== null) {
    // Revoke entire family (all sessions in this family)
    await prisma.refreshToken.updateMany({
      where: { family: stored.family, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw new UnauthorizedError('Refresh token reuse detected. Please log in again.');
  }

  // 3. Check expiry
  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    throw new UnauthorizedError('Refresh token has expired. Please log in again.');
  }

  // 4. Check user status
  if (stored.user.status !== 'ACTIVE') {
    throw new AppError('Account is suspended', 403, 'ACCOUNT_SUSPENDED');
  }

  // 5. Revoke used token (rotation: each refresh token is single-use)
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  // 6. Issue new token pair with same family (for rotation detection)
  return buildTokenPair(
    stored.user.id,
    stored.user.email,
    stored.user.role as UserRole,
    stored.family,  // Keep same family
    userAgent,
    ipAddress,
  );
}

/**
 * Revoke all refresh tokens for a user (logout all devices).
 */
export async function logout(userId: string, rawRefreshToken?: string): Promise<void> {
  if (rawRefreshToken) {
    // Logout current device only
    const tokenHash = hashToken(rawRefreshToken);
    await prisma.refreshToken.updateMany({
      where: { userId, tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } else {
    // Logout all devices
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

/**
 * Get authenticated user's profile (safe — no passwordHash).
 */
export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  return user;
}

/**
 * Verify a JWT access token and return its payload.
 * Throws UnauthorizedError on any failure.
 */
export function verifyAccessToken(token: string): JwtAccessPayload {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: 'parkease',
      audience: 'parkease-client',
    }) as JwtAccessPayload;

    return payload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Access token has expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid access token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
}

/**
 * Clean up expired refresh tokens (run periodically).
 */
export async function cleanExpiredTokens(): Promise<number> {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { revokedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // 30 days old
      ],
    },
  });
  return result.count;
}
