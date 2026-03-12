'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'rdsw-manual-overrides';

function load(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
}

function save(data: Record<string, string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export function useSchedule() {
  const [manualOverrides, setManualOverrides] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setManualOverrides(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) save(manualOverrides);
  }, [manualOverrides, ready]);

  const setManualOverride = useCallback((slotId: string, eventId: string) => {
    setManualOverrides(prev => ({ ...prev, [slotId]: eventId }));
  }, []);

  const clearManualOverride = useCallback((slotId: string) => {
    setManualOverrides(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }, []);

  return { manualOverrides, setManualOverride, clearManualOverride, ready };
}
