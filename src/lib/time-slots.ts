import { EnrichedEvent, TimeSlot, DaySchedule } from '@/types';

function toET(isoString: string): Date {
  return new Date(isoString);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getDateKey(isoString: string): string {
  const d = new Date(isoString);
  // Format in ET
  return d.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function getDayLabel(dateKey: string): string {
  const d = new Date(dateKey);
  return d.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
  });
}

function getShortDateLabel(dateKey: string): string {
  const d = new Date(dateKey);
  return d.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
  });
}

function getStartTimeKey(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function groupIntoSchedule(events: EnrichedEvent[]): DaySchedule[] {
  // Filter to conference dates only (April 20-24, 2026)
  const conferenceEvents = events.filter(e => {
    const d = new Date(e.startAt);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth(); // 0-indexed, April = 3
    const day = d.getUTCDate();
    return year === 2026 && month === 3 && day >= 20 && day <= 24;
  });

  // Group by date
  const byDay = new Map<string, EnrichedEvent[]>();
  for (const event of conferenceEvents) {
    const dateKey = getDateKey(event.startAt);
    const existing = byDay.get(dateKey) || [];
    existing.push(event);
    byDay.set(dateKey, existing);
  }

  const days: DaySchedule[] = [];

  for (const [dateKey, dayEvents] of byDay) {
    // Separate networking events from breakout sessions
    const breakouts = dayEvents.filter(e => !e.isNetworking);
    const networkingEvents = dayEvents.filter(e => e.isNetworking);

    // Group breakouts by start time
    const byStartTime = new Map<string, EnrichedEvent[]>();
    for (const event of breakouts) {
      const timeKey = getStartTimeKey(event.startAt);
      const existing = byStartTime.get(timeKey) || [];
      existing.push(event);
      byStartTime.set(timeKey, existing);
    }

    // Sort time keys
    const sortedTimeKeys = Array.from(byStartTime.keys()).sort();

    const timeSlots: TimeSlot[] = sortedTimeKeys.map(timeKey => {
      const slotEvents = byStartTime.get(timeKey)!;
      slotEvents.sort((a, b) => a.title.localeCompare(b.title));

      const startDate = toET(slotEvents[0].startAt);
      const endDates = slotEvents
        .map(e => toET(e.endAt))
        .sort((a, b) => b.getTime() - a.getTime());

      return {
        id: `${dateKey}-${timeKey}`,
        day: dateKey,
        startTime: formatTime(startDate),
        endTime: formatTime(endDates[0]),
        events: slotEvents,
      };
    });

    // Add networking events to each time slot that overlaps
    for (const netEvent of networkingEvents) {
      const netStart = toET(netEvent.startAt).getTime();
      const netEnd = toET(netEvent.endAt).getTime();

      for (const slot of timeSlots) {
        const slotStart = toET(slot.events[0].startAt).getTime();
        if (slotStart >= netStart && slotStart < netEnd) {
          slot.events.push(netEvent);
        }
      }

      // If networking event doesn't overlap any breakout slot, add its own slot
      const hasOverlap = timeSlots.some(slot => {
        const slotStart = toET(slot.events[0].startAt).getTime();
        return slotStart >= netStart && slotStart < netEnd;
      });

      if (!hasOverlap) {
        timeSlots.push({
          id: `${dateKey}-${getStartTimeKey(netEvent.startAt)}`,
          day: dateKey,
          startTime: formatTime(toET(netEvent.startAt)),
          endTime: formatTime(toET(netEvent.endAt)),
          events: [netEvent],
        });
      }
    }

    // Re-sort time slots
    timeSlots.sort((a, b) => a.id.localeCompare(b.id));

    // Determine city from first event
    const city = dayEvents[0]?.city === 'Raleigh' ? 'Raleigh' : 'Durham';

    days.push({
      date: dateKey,
      dayLabel: getDayLabel(dateKey),
      dateLabel: getShortDateLabel(dateKey),
      city,
      timeSlots,
    });
  }

  // Sort by date
  days.sort((a, b) => a.date.localeCompare(b.date));

  return days;
}

export function getPreConferenceEvents(events: EnrichedEvent[]): EnrichedEvent[] {
  return events.filter(e => {
    const d = new Date(e.startAt);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    return !(year === 2026 && month === 3 && day >= 20 && day <= 24);
  });
}
