// ============================================================
// Auth Provider — Placeholder
// ============================================================
// Full implementation in Phase 2 (Authentication).
// Provides auth context (user, login, logout, isAuthenticated).
// ============================================================

import { createContext, useContext, type ReactNode } from 'react';
import type { IUser } from '@parkease/shared';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // TODO: Phase 2 — Implement full auth state management
  const value: AuthContextType = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => {
      throw new Error('Auth not implemented yet');
    },
    logout: () => {
      throw new Error('Auth not implemented yet');
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
