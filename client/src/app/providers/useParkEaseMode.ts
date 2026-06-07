// ============================================================
// useParkEaseMode
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

export type ParkEaseMode = 'booking' | 'owner';

export const PARKEASE_MODE_KEY   = 'parkease_mode';
export const PARKEASE_MODE_EVENT = 'parkease_mode_changed';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  // Custom event for same-window updates
  window.addEventListener(PARKEASE_MODE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(PARKEASE_MODE_EVENT, callback);
  };
}

function getSnapshot(): ParkEaseMode {
  return (localStorage.getItem(PARKEASE_MODE_KEY) as ParkEaseMode) ?? 'booking';
}

function getServerSnapshot(): ParkEaseMode {
  return 'booking';
}

/**
 * Write mode to localStorage + fire the sync event.
 * Call this inside flushSync() before any navigation so all
 * subscribers see the updated mode on the first render of the
 * destination page.
 */
export function commitModeSync(newMode: ParkEaseMode) {
  localStorage.setItem(PARKEASE_MODE_KEY, newMode);
  window.dispatchEvent(new Event(PARKEASE_MODE_EVENT));
}

export function useParkEaseMode() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setMode = useCallback((newMode: ParkEaseMode) => {
    commitModeSync(newMode);
  }, []);

  return [mode, setMode] as const;
}
