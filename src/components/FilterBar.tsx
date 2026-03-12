'use client';

import { FilterState, FocusPreference, CityFilter } from '@/types';

interface FilterBarProps {
  filters: FilterState;
  onLocationChange: (location: CityFilter) => void;
  onFocusChange: (focus: FocusPreference) => void;
  onHotnessChange: (hotness: FilterState['hotness']) => void;
  onReset: () => void;
}

const LOCATION_OPTIONS: { value: CityFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Durham', label: '📍 Durham' },
  { value: 'Raleigh', label: '📍 Raleigh' },
];

const FOCUS_OPTIONS: { value: FocusPreference; label: string }[] = [
  { value: 'all', label: '✨ Best of Each' },
  { value: 'product', label: '🛠️ Product & Tech' },
  { value: 'strategy', label: '🧠 Strategy & Growth' },
  { value: 'revenue', label: '💰 Sales & Revenue' },
];

const HOTNESS_OPTIONS: { value: FilterState['hotness']; label: string; sub: string }[] = [
  { value: 'all', label: 'All', sub: '' },
  { value: 'popular', label: '🔥 Popular', sub: 'High sign-ups' },
  { value: 'deep-cut', label: '💎 Deep Cut', sub: 'Hidden gems' },
];

export default function FilterBar({
  filters,
  onLocationChange,
  onFocusChange,
  onHotnessChange,
  onReset,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.location !== 'all' ||
    filters.focus !== 'all' ||
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

          {/* Row 2: Focus preference */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Your Focus</span>
            <div className="flex gap-1">
              {FOCUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onFocusChange(opt.value)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                    filters.focus === opt.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
