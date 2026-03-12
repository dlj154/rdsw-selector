'use client';

import { useState, useCallback, useMemo } from 'react';
import { FilterState, PlayfulCategoryId, CityFilter, EnrichedEvent, DaySchedule } from '@/types';

const DEFAULT_FILTERS: FilterState = {
  location: 'all',
  topics: [],
  hotness: 'all',
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const setLocation = useCallback((location: CityFilter) => {
    setFilters(prev => ({ ...prev, location }));
  }, []);

  const toggleTopic = useCallback((topic: PlayfulCategoryId) => {
    setFilters(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic],
    }));
  }, []);

  const setHotness = useCallback((hotness: FilterState['hotness']) => {
    setFilters(prev => ({ ...prev, hotness }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return { filters, setLocation, toggleTopic, setHotness, resetFilters };
}

export function filterEvent(event: EnrichedEvent, filters: FilterState): boolean {
  // Location filter
  if (filters.location !== 'all' && event.city !== filters.location) {
    return false;
  }

  // Topic filter (if any topics selected, event must match one)
  if (filters.topics.length > 0 && !filters.topics.includes(event.category.id)) {
    return false;
  }

  // Hotness filter
  if (filters.hotness !== 'all') {
    if (event.hotness === null) return false;
    if (event.hotness !== filters.hotness) return false;
  }

  return true;
}

export function useFilteredSchedule(
  schedule: DaySchedule[],
  filters: FilterState
): DaySchedule[] {
  return useMemo(() => {
    return schedule.map(day => ({
      ...day,
      timeSlots: day.timeSlots.map(slot => ({
        ...slot,
        events: slot.events.filter(event => filterEvent(event, filters)),
      })),
    }));
  }, [schedule, filters]);
}
