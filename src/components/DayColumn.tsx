import { DaySchedule } from '@/types';
import TimeSlotGroup from './TimeSlotGroup';

interface DayColumnProps {
  day: DaySchedule;
  autoRecs: Record<string, string>;
  manualOverrides: Record<string, string>;
  onSwitch: (slotId: string, eventId: string) => void;
  onClearOverride: (slotId: string) => void;
}

export default function DayColumn({
  day,
  autoRecs,
  manualOverrides,
  onSwitch,
  onClearOverride,
}: DayColumnProps) {
  const nonEmptySlots = day.timeSlots.filter(s => s.events.length > 0);

  return (
    <div className="flex w-[320px] shrink-0 flex-col">
      {/* Day header */}
      <div className="mb-4 border-b-2 border-primary pb-2.5">
        <div className="font-heading text-base font-bold text-foreground">{day.dayLabel}</div>
        <div className="text-xs text-muted">{day.dateLabel} · {day.city}</div>
      </div>

      {nonEmptySlots.length > 0 ? (
        nonEmptySlots.map(slot => (
          <TimeSlotGroup
            key={slot.id}
            slot={slot}
            recommendedEventId={autoRecs[slot.id] ?? null}
            selectedEventId={manualOverrides[slot.id] ?? null}
            isManualOverride={!!manualOverrides[slot.id]}
            onSwitch={(eventId) => onSwitch(slot.id, eventId)}
            onClearOverride={() => onClearOverride(slot.id)}
          />
        ))
      ) : (
        <div className="py-10 text-center">
          <p className="text-sm text-muted">No sessions match your filters</p>
        </div>
      )}
    </div>
  );
}
