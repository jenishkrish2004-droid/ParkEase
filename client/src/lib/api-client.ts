// ============================================================
// Axios API Client
// ============================================================
// Centralized HTTP client with interceptors for auth tokens,
// automatic token refresh on 401, and error transformation.
// ============================================================

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { IApiErrorResponse } from '@parkease/shared';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  setAccessToken,
  clearTokens,
} from './token';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track ongoing refresh to prevent multiple simultaneous refreshes
let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingRequests = [];
}

// ============================================================
// Request Interceptor — Attach auth token
// ============================================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================
// Response Interceptor — Handle token refresh on 401
// ============================================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<IApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh on 401, once per request, and only if we have a refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken()!;
        const response = await axios.post<{
          success: true;
          data: { accessToken: string; refreshToken: string; expiresIn: number };
        }>(`${API_URL}/auth/refresh`, { refreshToken });

        const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.data;

        setTokens(accessToken, newRefreshToken, expiresIn);
        processQueue(null, accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        // Dispatch event so AuthProvider can react
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ============================================================
// Helper to extract error message from API error responses
// ============================================================
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as IApiErrorResponse | undefined;
    if (apiError?.error?.message) {
      return apiError.error.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/** Extract validation field errors from API response */
export function getApiValidationErrors(error: unknown): Record<string, string> {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as IApiErrorResponse | undefined;
    const details = apiError?.error?.details;
    if (details) {
      return Object.fromEntries(details.map((d) => [d.field, d.message]));
    }
  }
  return {};
}

export default apiClient;
