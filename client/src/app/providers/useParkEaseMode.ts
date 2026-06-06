// ============================================================
// useParkEaseMode
// ============================================================
// Hook to manage Booking vs Owner mode, synced with localStorage.
// Uses useSyncExternalStore for reactive updates across components.
// ============================================================

import { useSyncExternalStore, useCallback } from 'react';

export type ParkEaseMode = 'booking' | 'owner';

const STORAGE_KEY = 'parkease_mode';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  // Custom event for same-window updates
  window.addEventListener('parkease_mode_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('parkease_mode_changed', callback);
  };
}

function getSnapshot() {
  return (localStorage.getItem(STORAGE_KEY) as ParkEaseMode) ?? 'booking';
}

function getServerSnapshot() {
  return 'booking';
}

export function useParkEaseMode() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setMode = useCallback((newMode: ParkEaseMode) => {
    localStorage.setItem(STORAGE_KEY, newMode);
    window.dispatchEvent(new Event('parkease_mode_changed'));
  }, []);

  return [mode, setMode] as const;
}
