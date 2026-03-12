'use client';

import { TimeSlot } from '@/types';
import { FeaturedCard, CompactCard } from './EventCard';

interface TimeSlotGroupProps {
  slot: TimeSlot;
  recommendedEventId: string | null;
  selectedEventId: string | null;
  isManualOverride: boolean;
  onSwitch: (eventId: string) => void;
  onClearOverride: () => void;
}

export default function TimeSlotGroup({
  slot,
  recommendedEventId,
  selectedEventId,
  isManualOverride,
  onSwitch,
  onClearOverride,
}: TimeSlotGroupProps) {
  if (slot.events.length === 0) return null;

  // Resolve which event to feature: manual override > auto-rec > first event
  const featuredId = selectedEventId ?? recommendedEventId ?? slot.events[0].id;
  const featuredEvent = slot.events.find(e => e.id === featuredId) ?? slot.events[0];
  const alternatives = slot.events.filter(e => e.id !== featuredEvent.id);
  const isAutoRecommended = !isManualOverride && featuredId === recommendedEventId;

  return (
    <div className="mb-6">
      {/* Time header */}
      <div className="mb-2 flex items-center gap-2">
        <div className="font-heading text-sm font-bold text-foreground">
          {slot.startTime}
        </div>
        <div className="h-px flex-1 bg-card-border" />
        {slot.events.length > 1 && (
          <div className="text-xs text-muted">
            {slot.events.length} options
          </div>
        )}
      </div>

      {/* Featured card */}
      <FeaturedCard
        event={featuredEvent}
        isAutoRecommended={isAutoRecommended}
        isManualOverride={isManualOverride}
        onRevertToAuto={isManualOverride ? onClearOverride : undefined}
      />

      {/* Alternative options */}
      {alternatives.length > 0 && (
        <div className="mt-2 flex flex-col gap-1.5">
          {alternatives.map(event => (
            <CompactCard
              key={event.id}
              event={event}
              onSwitch={() => onSwitch(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
