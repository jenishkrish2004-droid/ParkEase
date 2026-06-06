// ============================================================
// Token Management Utilities
// ============================================================
// Centralised helpers for storing, reading, and clearing
// access/refresh tokens from localStorage.
// ============================================================

const ACCESS_TOKEN_KEY  = 'parkease_access_token';
const REFRESH_TOKEN_KEY = 'parkease_refresh_token';
const TOKEN_EXPIRY_KEY  = 'parkease_token_expiry';

// ── Accessors ────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getTokenExpiry(): number | null {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
}

export function isAccessTokenExpired(): boolean {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  // Consider expired if within 30s of actual expiry (buffer for clock drift)
  return Date.now() >= expiry - 30_000;
}

// ── Setters ──────────────────────────────────────────────────

export function setTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number, // seconds
): void {
  const expiryMs = Date.now() + expiresIn * 1000;
  localStorage.setItem(ACCESS_TOKEN_KEY,  accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY,  String(expiryMs));
}

export function setAccessToken(accessToken: string, expiresIn: number): void {
  const expiryMs = Date.now() + expiresIn * 1000;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiryMs));
}

// ── Cleanup ──────────────────────────────────────────────────

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

// ── Helpers ──────────────────────────────────────────────────

/** Check if any session tokens exist */
export function hasSession(): boolean {
  return !!getAccessToken() && !!getRefreshToken();
}
