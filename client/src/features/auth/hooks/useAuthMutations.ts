// ============================================================
// Auth Hooks — useLogin, useRegister, useLogout
// ============================================================
// React Query mutations wrapping auth service calls.
// ============================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { showToast } from '@/components/ui/Toast';
import { getApiErrorMessage } from '@/lib/api-client';
import type { LoginPayload, RegisterPayload } from '../auth.types';

// ── useLogin ─────────────────────────────────────────────────

export function useLogin() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: () => {
      queryClient.clear(); // Clear stale data from previous session
      showToast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });
}

// ── useRegister ──────────────────────────────────────────────

export function useRegister() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      queryClient.clear();
      showToast.success('Account created successfully! Welcome to ParkEase.');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });
}

// ── useLogout ────────────────────────────────────────────────

export function useLogout() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.clear();
      showToast.success('You have been logged out.');
      navigate('/', { replace: true });
    },
    onError: () => {
      // Even if server call fails, clear locally and redirect
      queryClient.clear();
      navigate('/', { replace: true });
    },
  });
}

// ── useLogoutAll ─────────────────────────────────────────────

export function useLogoutAll() {
  const { logoutAll } = useAuth();
  const navigate      = useNavigate();
  const queryClient   = useQueryClient();

  return useMutation({
    mutationFn: () => logoutAll(),
    onSuccess: () => {
      queryClient.clear();
      showToast.success('Logged out from all devices.');
      navigate('/', { replace: true });
    },
  });
}
