import { EnrichedEvent, FilterState, FocusPreference, TimeSlot, DaySchedule } from '@/types';

const FOCUS_TO_CATEGORY: Record<Exclude<FocusPreference, 'all'>, string> = {
  product: 'build-cool-stuff',
  strategy: 'big-brain-energy',
  revenue: 'cha-ching',
};

export function scoreEvent(event: EnrichedEvent, filters: FilterState): number {
  let score = 0;

  // Location match: +3
  if (filters.location === 'all' || event.city === filters.location) score += 3;

  // Focus match: +5 for matching category; 'all' = no category bonus
  if (filters.focus !== 'all') {
    if (event.category.id === FOCUS_TO_CATEGORY[filters.focus]) score += 5;
  }

  // Hotness match: +2
  if (filters.hotness === 'all' || event.hotness === filters.hotness) score += 2;

  // Tiebreaker: slightly favor more popular events
  if (event.guestCount !== null) score += event.guestCount / 500;

  return score;
}

export function recommendEventId(slot: TimeSlot, filters: FilterState): string | null {
  if (slot.events.length === 0) return null;

  // Prefer non-networking events for the recommendation
  const candidates = slot.events.filter(e => !e.isNetworking);
  const pool = candidates.length > 0 ? candidates : slot.events;

  if (pool.length === 1) return pool[0].id;

  return pool.reduce((best, event) =>
    scoreEvent(event, filters) > scoreEvent(best, filters) ? event : best
  ).id;
}

export function computeAutoRecommendations(
  schedule: DaySchedule[],
  filters: FilterState
): Record<string, string> {
  const recs: Record<string, string> = {};
  for (const day of schedule) {
    for (const slot of day.timeSlots) {
      const id = recommendEventId(slot, filters);
      if (id) recs[slot.id] = id;
    }
  }
  return recs;
}

/** Returns true if the event is a perfect match for all active filters */
export function isPerfectMatch(event: EnrichedEvent, filters: FilterState): boolean {
  const locationOk = filters.location === 'all' || event.city === filters.location;
  const focusOk = filters.focus === 'all' ||
    event.category.id === FOCUS_TO_CATEGORY[filters.focus];
  const hotnessOk = filters.hotness === 'all' || event.hotness === filters.hotness;
  return locationOk && focusOk && hotnessOk;
}
