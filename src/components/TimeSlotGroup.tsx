'use client';

import { TimeSlot } from '@/types';
import EventCard from './EventCard';

interface TimeSlotGroupProps {
  slot: TimeSlot;
  selectedEventId: string | null;
  onSelectEvent: (eventId: string) => void;
}

export default function TimeSlotGroup({
  slot,
  selectedEventId,
  onSelectEvent,
}: TimeSlotGroupProps) {
  if (slot.events.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Time header */}
      <div className="mb-3 flex items-center gap-3">
        <div className="font-heading text-lg font-bold text-foreground">
          {slot.startTime}
        </div>
        <div className="h-px flex-1 bg-card-border" />
        <div className="text-xs text-muted">
          {slot.events.length} session{slot.events.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Event cards grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {slot.events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isSelected={selectedEventId === event.id}
            onSelect={() => onSelectEvent(event.id)}
          />
        ))}
      </div>
    </div>
  );
}
