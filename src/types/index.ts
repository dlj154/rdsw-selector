// Raw Luma API types

export interface LumaGeoAddressInfo {
  city?: string;
  region?: string;
  address?: string;
  full_address?: string;
  type?: string;
  mode?: string;
}

export interface LumaEvent {
  api_id: string;
  name: string;
  start_at: string;
  end_at: string | null;
  timezone: string;
  url: string;
  cover_url: string | null;
  location_type: string;
  geo_address_info: LumaGeoAddressInfo | null;
  coordinate: { longitude: number; latitude: number } | null;
  show_guest_list?: boolean;
  calendar_api_id?: string;
  event_type?: string;
  hide_rsvp?: boolean;
  visibility?: string;
  waitlist_enabled?: boolean;
  user_api_id?: string;
  // External events have these differently
  host?: string;
  duration_interval?: string;
}

export interface LumaTag {
  api_id?: string;
  name: string;
  color: string;
}

export interface LumaHost {
  name: string;
  avatar_url: string;
}

export interface LumaFeaturedGuest {
  name: string;
  avatar_url: string;
  bio: string;
}

export interface LumaTicketInfo {
  price: number | null;
  is_free: boolean;
  is_sold_out: boolean;
  is_near_capacity: boolean;
  spots_remaining: number | null;
}

export interface LumaEntry {
  api_id: string;
  event: LumaEvent;
  tags: LumaTag[];
  platform: 'luma' | 'external';
  guest_count?: number;
  ticket_count?: number;
  ticket_info?: LumaTicketInfo;
  hosts?: LumaHost[];
  featured_guests?: LumaFeaturedGuest[];
  start_at?: string;
  calendar?: {
    api_id: string;
    name: string;
    slug: string;
    tint_color: string;
  };
  cover_image?: {
    colors: string[];
  } | null;
}

export interface LumaCalendarResponse {
  entries: LumaEntry[];
  has_more: boolean;
}

// App types

export type PlayfulCategoryId =
  | 'main-stage'
  | 'build-cool-stuff'
  | 'big-brain-energy'
  | 'cha-ching'
  | 'squad-goals'
  | 'wildcard';

export interface PlayfulCategory {
  id: PlayfulCategoryId;
  label: string;
  emoji: string;
  description: string;
  badgeClass: string;
  badgeTextClass: string;
}

export type HotnessLevel = 'popular' | 'deep-cut' | null;

export type CityFilter = 'all' | 'Durham' | 'Raleigh';

export interface EnrichedEvent {
  id: string;
  title: string;
  startAt: string; // ISO string
  endAt: string;   // ISO string
  timezone: string;
  venue: string;
  fullAddress: string;
  city: 'Durham' | 'Raleigh' | 'Other';
  registrationUrl: string;
  coverUrl: string | null;
  guestCount: number | null;
  hotness: HotnessLevel;
  category: PlayfulCategory;
  tags: string[];
  platform: 'luma' | 'external';
  isSoldOut: boolean;
  isNearCapacity: boolean;
  hosts: Array<{ name: string; avatarUrl: string }>;
  speakers: Array<{ name: string; avatarUrl: string; bio: string }>;
  isNetworking: boolean;
  isKeynote: boolean;
}

export interface TimeSlot {
  id: string;
  day: string;       // "2026-04-21"
  startTime: string;  // "2:00 PM"
  endTime: string;    // "2:50 PM"
  events: EnrichedEvent[];
}

export interface DaySchedule {
  date: string;
  dayLabel: string;    // "Monday"
  dateLabel: string;   // "Apr 20"
  city: 'Durham' | 'Raleigh';
  timeSlots: TimeSlot[];
}

export interface FilterState {
  location: CityFilter;
  topics: PlayfulCategoryId[];
  hotness: 'all' | 'popular' | 'deep-cut';
}
