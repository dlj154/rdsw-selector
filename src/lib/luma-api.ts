import { LumaCalendarResponse, LumaEntry, EnrichedEvent } from '@/types';
import { categorizeEvent } from './categories';
import { computeMedianThreshold, classifyHotness } from './hotness';

const LUMA_API_URL =
  'https://api.lu.ma/calendar/get-items?calendar_api_id=cal-Bs6d6s7UKo6J72D';

function inferCity(entry: LumaEntry): 'Durham' | 'Raleigh' | 'Other' {
  const geo = entry.event.geo_address_info;
  if (!geo) return 'Other';

  if (geo.city) {
    if (geo.city.toLowerCase().includes('raleigh')) return 'Raleigh';
    if (geo.city.toLowerCase().includes('durham')) return 'Durham';
  }

  // Fallback: check full_address or address
  const addr = (geo.full_address || geo.address || '').toLowerCase();
  if (addr.includes('raleigh')) return 'Raleigh';
  if (addr.includes('durham')) return 'Durham';

  return 'Other';
}

function getRegistrationUrl(entry: LumaEntry): string {
  if (entry.platform === 'external') {
    return entry.event.url;
  }
  return `https://lu.ma/${entry.event.url}`;
}

function getVenueName(entry: LumaEntry): string {
  const geo = entry.event.geo_address_info;
  if (!geo) return 'TBD';
  return geo.address || geo.full_address || 'TBD';
}

function getFullAddress(entry: LumaEntry): string {
  const geo = entry.event.geo_address_info;
  if (!geo) return '';
  return geo.full_address || geo.address || '';
}

function computeEndAt(entry: LumaEntry): string {
  if (entry.event.end_at) return entry.event.end_at;

  // External events: parse duration_interval or default to 50 min
  const start = new Date(entry.event.start_at);
  if (entry.event.duration_interval) {
    // Parse ISO 8601 duration like "P0Y0M0DT9H30M0S"
    const match = entry.event.duration_interval.match(
      /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );
    if (match) {
      const hours = parseInt(match[1] || '0', 10);
      const minutes = parseInt(match[2] || '0', 10);
      start.setMinutes(start.getMinutes() + hours * 60 + minutes);
      return start.toISOString();
    }
  }

  // Default: 50 minutes
  start.setMinutes(start.getMinutes() + 50);
  return start.toISOString();
}

function transformEntry(entry: LumaEntry, median: number): EnrichedEvent {
  const tagNames = entry.tags.map(t => t.name);
  const isNetworking = tagNames.includes('Networking');
  const isKeynote = tagNames.includes('Keynotes');

  return {
    id: entry.api_id,
    title: entry.event.name,
    startAt: entry.event.start_at,
    endAt: computeEndAt(entry),
    timezone: entry.event.timezone || 'America/New_York',
    venue: getVenueName(entry),
    fullAddress: getFullAddress(entry),
    city: inferCity(entry),
    registrationUrl: getRegistrationUrl(entry),
    coverUrl: entry.event.cover_url || null,
    guestCount: entry.guest_count ?? null,
    hotness: classifyHotness(entry.guest_count ?? null, median),
    category: categorizeEvent(tagNames),
    tags: tagNames.filter(t => t !== 'RDSW26'),
    platform: entry.platform,
    isSoldOut: entry.ticket_info?.is_sold_out ?? false,
    isNearCapacity: entry.ticket_info?.is_near_capacity ?? false,
    hosts: (entry.hosts || []).map(h => ({
      name: h.name,
      avatarUrl: h.avatar_url,
    })),
    speakers: (entry.featured_guests || []).map(g => ({
      name: g.name,
      avatarUrl: g.avatar_url,
      bio: g.bio,
    })),
    isNetworking,
    isKeynote,
  };
}

export async function fetchEvents(): Promise<EnrichedEvent[]> {
  const response = await fetch(LUMA_API_URL);

  if (!response.ok) {
    throw new Error(`Luma API error: ${response.status}`);
  }

  const data: LumaCalendarResponse = await response.json();

  // Compute median guest count for hotness threshold
  const guestCounts = data.entries.map(e => e.guest_count ?? null);
  const median = computeMedianThreshold(guestCounts);

  return data.entries.map(entry => transformEntry(entry, median));
}
