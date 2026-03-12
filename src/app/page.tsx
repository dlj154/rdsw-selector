'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import DayTabs from '@/components/DayTabs';
import TimeSlotGroup from '@/components/TimeSlotGroup';
import ExportBar from '@/components/ExportBar';
import Footer from '@/components/Footer';
import { useEvents } from '@/hooks/useEvents';
import { useFilters, useFilteredSchedule } from '@/hooks/useFilters';
import { useSchedule } from '@/hooks/useSchedule';

export default function Home() {
  const { data, loading, error } = useEvents();
  const { filters, setLocation, toggleTopic, setHotness, resetFilters } = useFilters();
  const { selections, toggleSelection, selectedEventIds, selectedCount } = useSchedule();
  const [activeDay, setActiveDay] = useState(0);

  const filteredSchedule = useFilteredSchedule(data?.schedule ?? [], filters);

  const totalSlots = useMemo(() => {
    if (!data?.schedule) return 0;
    return data.schedule.reduce((acc, day) => acc + day.timeSlots.length, 0);
  }, [data?.schedule]);

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

  const currentDay = filteredSchedule[activeDay];

  return (
    <div className="min-h-screen">
      <Header />
      <FilterBar
        filters={filters}
        onLocationChange={setLocation}
        onTopicToggle={toggleTopic}
        onHotnessChange={setHotness}
        onReset={resetFilters}
      />

      {filteredSchedule.length > 0 && (
        <>
          <DayTabs
            days={filteredSchedule}
            activeDay={activeDay}
            onDayChange={setActiveDay}
          />

          <main className="mx-auto max-w-5xl px-4 py-6">
            {currentDay ? (
              currentDay.timeSlots.length > 0 ? (
                currentDay.timeSlots.map(slot => {
                  if (slot.events.length === 0) return null;
                  return (
                    <TimeSlotGroup
                      key={slot.id}
                      slot={slot}
                      selectedEventId={selections[slot.id] ?? null}
                      onSelectEvent={(eventId) => toggleSelection(slot.id, eventId)}
                    />
                  );
                })
              ) : (
                <div className="py-16 text-center">
                  <p className="font-heading text-xl text-muted">
                    Nothing matches your vibe here 🤷
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Try adjusting your filters to see more sessions.
                  </p>
                </div>
              )
            ) : null}
          </main>
        </>
      )}

      <Footer />

      <ExportBar
        selectedCount={selectedCount}
        totalSlots={totalSlots}
        selectedEventIds={selectedEventIds}
      />
    </div>
  );
}
