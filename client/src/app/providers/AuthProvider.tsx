// ============================================================
// Auth Provider — Full Implementation (Phase 2)
// ============================================================
// Manages auth state, token refresh, and provides context.
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { IUser } from '@parkora/shared';
import * as authService from '@/features/auth/auth.service';
import { getRefreshToken, hasSession, clearTokens } from '@/lib/token';
import type { AuthContextValue, LoginPayload, RegisterPayload, VerifyRegistrationPayload } from '@/features/auth/auth.types';

// ── Context ──────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true — checking session

  // ── Bootstrap: restore session on mount ──────────────────
  useEffect(() => {
    async function restoreSession() {
      if (!hasSession()) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await authService.getMe();
        setUser(me);
      } catch {
        // Token invalid or expired — clear storage
        clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // ── Listen for session expiry (from api-client interceptor) ──
  useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
      clearTokens();
    }

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  // ── Auth Actions ─────────────────────────────────────────

  const login = useCallback(async (payload: LoginPayload) => {
    const { user: authUser } = await authService.login(payload);
    setUser(authUser as IUser);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    return await authService.register(payload);
  }, []);

  const verifyRegistration = useCallback(async (payload: VerifyRegistrationPayload) => {
    const { user: authUser } = await authService.verifyRegistration(payload);
    setUser(authUser as IUser);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken() ?? undefined;
    await authService.logout(refreshToken);
    setUser(null);
  }, []);

  const logoutAll = useCallback(async () => {
    await authService.logoutAll();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authService.getMe();
      setUser(me);
    } catch {
      setUser(null);
      clearTokens();
    }
  }, []);

  // ── Context Value ────────────────────────────────────────

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    verifyRegistration,
    logout,
    logoutAll,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
