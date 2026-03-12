'use client';

import { useState, useCallback, useEffect } from 'react';
import { FilterState, FocusPreference, CityFilter } from '@/types';

const FOCUS_KEY = 'rdsw-focus';
const FOCUS_SET_KEY = 'rdsw-focus-set';

function loadFocus(): FocusPreference {
  if (typeof window === 'undefined') return 'all';
  try {
    const stored = localStorage.getItem(FOCUS_KEY);
    if (stored === 'product' || stored === 'strategy' || stored === 'revenue' || stored === 'all') {
      return stored;
    }
  } catch {}
  return 'all';
}

function loadFocusSet(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(FOCUS_SET_KEY) === 'true';
}

const DEFAULT_FILTERS: FilterState = {
  location: 'all',
  focus: 'all',
  hotness: 'all',
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isFocusSet, setIsFocusSet] = useState(true); // true on SSR to prevent modal flash
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFilters(prev => ({ ...prev, focus: loadFocus() }));
    setIsFocusSet(loadFocusSet());
    setHydrated(true);
  }, []);

  const setLocation = useCallback((location: CityFilter) => {
    setFilters(prev => ({ ...prev, location }));
  }, []);

  const setFocus = useCallback((focus: FocusPreference) => {
    setFilters(prev => ({ ...prev, focus }));
    try {
      localStorage.setItem(FOCUS_KEY, focus);
      localStorage.setItem(FOCUS_SET_KEY, 'true');
    } catch {}
    setIsFocusSet(true);
  }, []);

  const setHotness = useCallback((hotness: FilterState['hotness']) => {
    setFilters(prev => ({ ...prev, hotness }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, focus: loadFocus() });
  }, []);

  return { filters, setLocation, setFocus, setHotness, resetFilters, isFocusSet, hydrated };
}
