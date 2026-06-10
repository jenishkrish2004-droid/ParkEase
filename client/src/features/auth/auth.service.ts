// ============================================================
// Auth Feature — API Service
// ============================================================
// All authentication API calls go through this service.
// ============================================================

import apiClient from '@/lib/api-client';
import { setTokens, clearTokens } from '@/lib/token';
import type { AuthResponse, LoginPayload, RegisterPayload, RegisterResponse, VerifyRegistrationPayload } from './auth.types';
import type { IUser } from '@parkora/shared';

type ApiResult<T> = { success: true; data: T };

// ── Register ─────────────────────────────────────────────────
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await apiClient.post<ApiResult<RegisterResponse>>('/auth/register', payload);
  return response.data.data;
}

export async function verifyRegistration(payload: VerifyRegistrationPayload): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResult<AuthResponse>>('/auth/verify-registration', payload);
  const data = response.data.data;

  setTokens(data.accessToken, data.refreshToken, data.expiresIn);
  return data;
}

// ── Login ────────────────────────────────────────────────────
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResult<AuthResponse>>('/auth/login', payload);
  const data = response.data.data;

  setTokens(data.accessToken, data.refreshToken, data.expiresIn);
  return data;
}

// ── Logout ───────────────────────────────────────────────────
export async function logout(refreshToken?: string): Promise<void> {
  try {
    await apiClient.post('/auth/logout', { refreshToken });
  } finally {
    clearTokens(); // Always clear locally
  }
}

// ── Logout All ───────────────────────────────────────────────
export async function logoutAll(): Promise<void> {
  try {
    await apiClient.post('/auth/logout-all');
  } finally {
    clearTokens();
  }
}

// ── Get Current User ─────────────────────────────────────────
export async function getMe(): Promise<IUser> {
  const response = await apiClient.get<ApiResult<{ user: IUser }>>('/auth/me');
  return response.data.data.user;
}
