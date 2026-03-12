'use client';

import { FilterState, PlayfulCategoryId, CityFilter } from '@/types';
import { CATEGORIES } from '@/lib/categories';

interface FilterBarProps {
  filters: FilterState;
  onLocationChange: (location: CityFilter) => void;
  onTopicToggle: (topic: PlayfulCategoryId) => void;
  onHotnessChange: (hotness: FilterState['hotness']) => void;
  onReset: () => void;
}

// Clearer descriptions shown as subtitle on each chip
const CATEGORY_SUBTITLES: Record<string, string> = {
  'main-stage': 'Keynotes & talks',
  'build-cool-stuff': 'Product & AI',
  'big-brain-energy': 'Strategy & vision',
  'cha-ching': 'Sales & revenue',
  'squad-goals': 'Networking',
  'wildcard': 'Partner events',
};

const LOCATION_OPTIONS: { value: CityFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Durham', label: '📍 Durham' },
  { value: 'Raleigh', label: '📍 Raleigh' },
];

const HOTNESS_OPTIONS: { value: FilterState['hotness']; label: string; sub: string }[] = [
  { value: 'all', label: 'All', sub: '' },
  { value: 'popular', label: '🔥 Popular', sub: 'High sign-ups' },
  { value: 'deep-cut', label: '💎 Deep Cut', sub: 'Hidden gems' },
];

export default function FilterBar({
  filters,
  onLocationChange,
  onTopicToggle,
  onHotnessChange,
  onReset,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.location !== 'all' ||
    filters.topics.length > 0 ||
    filters.hotness !== 'all';

  return (
    <div className="sticky top-0 z-30 border-b border-card-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-col gap-3">

          {/* Row 1: Location + Hotness */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Location</span>
              <div className="flex gap-1">
                {LOCATION_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onLocationChange(opt.value)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                      filters.location === opt.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Popularity</span>
              <div className="flex gap-1">
                {HOTNESS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onHotnessChange(opt.value)}
                    title={opt.sub}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                      filters.hotness === opt.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                    {opt.sub && (
                      <span className="ml-1 hidden text-xs opacity-75 sm:inline">· {opt.sub}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="ml-auto text-sm font-medium text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Row 2: Topic chips with two-line labels */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Topic</span>
            {CATEGORIES.map(cat => {
              const isActive = filters.topics.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => onTopicToggle(cat.id)}
                  className={`inline-flex flex-col items-start rounded-lg px-3 py-1.5 text-left transition-all ${
                    isActive
                      ? `${cat.badgeClass} ${cat.badgeTextClass} ring-2 ring-offset-1 ring-current shadow-sm`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-sm font-semibold leading-tight">
                    {cat.emoji} {cat.label}
                  </span>
                  <span className={`text-xs leading-tight ${isActive ? 'opacity-75' : 'text-gray-400'}`}>
                    {CATEGORY_SUBTITLES[cat.id]}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
