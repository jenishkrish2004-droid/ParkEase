// ============================================================
// Protected Route Wrapper
// ============================================================
// Redirects unauthenticated users to /login.
// Passes the intended destination via location state.
// Shows a full-screen spinner while auth state is loading.
// ============================================================

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { FullPageSpinner } from '@/components/ui/Spinner';
import type { UserRole } from '@parkease/shared';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Require the user to be an admin */
  requireAdmin?: boolean;
  /** Require the user to be a verified owner */
  requireOwner?: boolean;
  /** Where to redirect after successful login */
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAdmin,
  requireOwner,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // While checking session (e.g., /auth/me call on mount)
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // Not logged in — redirect preserving intended destination
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  // Check admin requirement
  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check owner requirement
  if (requireOwner && (!user?.isOwner || !user?.ownerVerified)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// ── Public-only route (redirect logged-in users away) ────────
interface PublicOnlyRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PublicOnlyRoute({ children, redirectTo = '/' }: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
