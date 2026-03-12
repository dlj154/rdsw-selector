'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'rdsw-selections';

function loadSelections(): Record<string, string | null> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveSelections(selections: Record<string, string | null>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  } catch {
    // Silently fail if localStorage is full
  }
}

export function useSchedule() {
  const [selections, setSelections] = useState<Record<string, string | null>>({});
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setSelections(loadSelections());
    setLoaded(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (loaded) {
      saveSelections(selections);
    }
  }, [selections, loaded]);

  const toggleSelection = useCallback((slotId: string, eventId: string) => {
    setSelections(prev => ({
      ...prev,
      [slotId]: prev[slotId] === eventId ? null : eventId,
    }));
  }, []);

  const clearSelections = useCallback(() => {
    setSelections({});
  }, []);

  const selectedEventIds = useMemo(() => {
    return Object.values(selections).filter((id): id is string => id !== null);
  }, [selections]);

  const selectedCount = selectedEventIds.length;

  return {
    selections,
    toggleSelection,
    clearSelections,
    selectedEventIds,
    selectedCount,
    loaded,
  };
}
