'use client';

import { useState, useEffect } from 'react';
import { DaySchedule, EnrichedEvent } from '@/types';

interface EventsData {
  schedule: DaySchedule[];
  preConference: EnrichedEvent[];
  totalEvents: number;
}

export function useEvents() {
  const [data, setData] = useState<EventsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error };
}
