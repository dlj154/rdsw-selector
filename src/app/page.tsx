'use client';

import { useMemo } from 'react';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import FocusPicker from '@/components/FocusPicker';
import DayColumn from '@/components/DayColumn';
import ExportBar from '@/components/ExportBar';
import Footer from '@/components/Footer';
import { useEvents } from '@/hooks/useEvents';
import { useFilters } from '@/hooks/useFilters';
import { useSchedule } from '@/hooks/useSchedule';
import { computeAutoRecommendations } from '@/lib/recommendations';

export default function Home() {
  const { data, loading, error } = useEvents();
  const { filters, setLocation, setFocus, setHotness, resetFilters, isFocusSet, hydrated } = useFilters();
  const { manualOverrides, setManualOverride, clearManualOverride } = useSchedule();

  // Filter days by location (hard filter); show all events within each slot
  const displaySchedule = useMemo(() => {
    if (!data?.schedule) return [];
    if (filters.location === 'all') return data.schedule;
    return data.schedule
      .filter(day => day.city === filters.location)
      .map(day => ({
        ...day,
        timeSlots: day.timeSlots.map(slot => ({
          ...slot,
          events: slot.events.filter(e => e.city === filters.location),
        })),
      }));
  }, [data?.schedule, filters.location]);

  // Auto-recommendations driven by all filters (topic + hotness affect scoring)
  const autoRecs = useMemo(
    () => computeAutoRecommendations(displaySchedule, filters),
    [displaySchedule, filters]
  );

  // Merged: manual override wins over auto-rec
  const activeSelections = useMemo(() => {
    const merged: Record<string, string> = { ...autoRecs };
    for (const [slotId, eventId] of Object.entries(manualOverrides)) {
      merged[slotId] = eventId;
    }
    return merged;
  }, [autoRecs, manualOverrides]);

  const totalSlots = useMemo(
    () => displaySchedule.reduce((acc, day) =>
      acc + day.timeSlots.filter(s => s.events.length > 0).length, 0),
    [displaySchedule]
  );

  const selectedCount = Object.keys(activeSelections).length;
  const selectedEventIds = Object.values(activeSelections);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-heading text-lg text-muted">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-heading text-xl text-red-600">Oops!</p>
          <p className="mt-2 text-muted">{error || 'Failed to load sessions'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <FilterBar
        filters={filters}
        onLocationChange={setLocation}
        onFocusChange={setFocus}
        onHotnessChange={setHotness}
        onReset={resetFilters}
      />

      {displaySchedule.length > 0 ? (
        <div className="overflow-x-auto pb-24">
          <div className="flex gap-5 px-4 py-6" style={{ minWidth: 'max-content' }}>
            {displaySchedule.map(day => (
              <DayColumn
                key={day.date}
                day={day}
                autoRecs={autoRecs}
                manualOverrides={manualOverrides}
                onSwitch={setManualOverride}
                onClearOverride={clearManualOverride}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="font-heading text-xl text-muted">No sessions found</p>
          <p className="mt-2 text-sm text-muted">Try adjusting your filters.</p>
        </div>
      )}

      <Footer />

      <ExportBar
        selectedCount={selectedCount}
        totalSlots={totalSlots}
        selectedEventIds={selectedEventIds}
      />

      {hydrated && !isFocusSet && (
        <FocusPicker
          onSelect={({ focus, location, hotness }) => {
            setFocus(focus);
            setLocation(location);
            setHotness(hotness);
          }}
        />
      )}
    </div>
  );
}
