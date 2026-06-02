// ============================================================
// Axios API Client
// ============================================================
// Centralized HTTP client with interceptors for auth tokens,
// error handling, and request/response transformation.
// ============================================================

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { IApiErrorResponse } from '@parkease/shared';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// Request Interceptor — Attach auth token
// ============================================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================
// Response Interceptor — Handle token refresh & errors
// ============================================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<IApiErrorResponse>) => {
    // TODO: Phase 2 — Implement token refresh on 401
    // const originalRequest = error.config;
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   const newToken = await refreshAccessToken();
    //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
    //   return apiClient(originalRequest);
    // }

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

export default apiClient;
