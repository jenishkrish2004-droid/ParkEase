// ============================================================
// Auth Feature — Frontend Types
// ============================================================

import type { IUser } from '@parkease/shared';

export interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number;  // seconds
}

export interface AuthResponse {
  user:   IUser;
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number;
}

export interface RegisterPayload {
  firstName:       string;
  lastName:        string;
  email:           string;
  password:        string;
  confirmPassword: string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface AuthContextValue {
  user:              IUser | null;
  isAuthenticated:   boolean;
  isLoading:         boolean;
  login:             (payload: LoginPayload) => Promise<void>;
  register:          (payload: RegisterPayload) => Promise<void>;
  logout:            () => Promise<void>;
  logoutAll:         () => Promise<void>;
  refreshUser:       () => Promise<void>;
}
