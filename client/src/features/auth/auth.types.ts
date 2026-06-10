// ============================================================
// Auth Feature — Frontend Types
// ============================================================

import type { IUser } from '@parkora/shared';

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
  identifier:      string;
  password:        string;
  confirmPassword: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email?: string;
    phone?: string;
  };
  message: string;
}

export interface VerifyRegistrationPayload {
  userId: string;
  otp: string;
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
  register:          (payload: RegisterPayload) => Promise<RegisterResponse>;
  verifyRegistration: (payload: VerifyRegistrationPayload) => Promise<void>;
  logout:            () => Promise<void>;
  logoutAll:         () => Promise<void>;
  refreshUser:       () => Promise<void>;
}
