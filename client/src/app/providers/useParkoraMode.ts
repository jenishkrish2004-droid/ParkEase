// ============================================================
// useParkoraMode
// ============================================================
// Hook to manage Booking vs Owner mode, synced with localStorage.
// Uses useSyncExternalStore for reactive updates across components.
//
// IMPORTANT: setMode writes to localStorage synchronously, then
// dispatches a custom event so all subscribers re-render. Use
// commitModeSync (wrapped in flushSync) in event handlers that
// also navigate to prevent stale-mode reads on the destination page.
// ============================================================

import { useSyncExternalStore, useCallback } from 'react';

export type ParkoraMode = 'booking' | 'owner';

export const PARKORA_MODE_KEY   = 'parkora_mode';
export const PARKORA_MODE_EVENT = 'parkora_mode_changed';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  // Custom event for same-window updates
  window.addEventListener(PARKORA_MODE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(PARKORA_MODE_EVENT, callback);
  };
}

function getSnapshot(): ParkoraMode {
  return (localStorage.getItem(PARKORA_MODE_KEY) as ParkoraMode) ?? 'booking';
}

function getServerSnapshot(): ParkoraMode {
  return 'booking';
}

/**
 * Write mode to localStorage + fire the sync event.
 * Call this inside flushSync() before any navigation so all
 * subscribers see the updated mode on the first render of the
 * destination page.
 */
export function commitModeSync(newMode: ParkoraMode) {
  localStorage.setItem(PARKORA_MODE_KEY, newMode);
  window.dispatchEvent(new Event(PARKORA_MODE_EVENT));
}

export function useParkoraMode() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setMode = useCallback((newMode: ParkoraMode) => {
    commitModeSync(newMode);
  }, []);

  return [mode, setMode] as const;
}

export const EV_BUSINESS_MODE_KEY = 'ev_business_mode_enabled';
export const EV_BUSINESS_MODE_EVENT = 'ev_business_mode_changed';

function subscribeEv(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(EV_BUSINESS_MODE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EV_BUSINESS_MODE_EVENT, callback);
  };
}

function getEvSnapshot(): boolean {
  // Default to true for EV partners, meaning they see EV Business by default
  return localStorage.getItem(EV_BUSINESS_MODE_KEY) !== 'false';
}

function getServerEvSnapshot(): boolean {
  return true;
}

export function commitEvBusinessModeSync(enabled: boolean) {
  localStorage.setItem(EV_BUSINESS_MODE_KEY, enabled ? 'true' : 'false');
  window.dispatchEvent(new Event(EV_BUSINESS_MODE_EVENT));
}

export function useEvBusinessMode() {
  const enabled = useSyncExternalStore(subscribeEv, getEvSnapshot, getServerEvSnapshot);

  const setEnabled = useCallback((newEnabled: boolean) => {
    commitEvBusinessModeSync(newEnabled);
  }, []);

  return [enabled, setEnabled] as const;
}
