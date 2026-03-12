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

const LOCATION_OPTIONS: { value: CityFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Durham', label: '📍 Durham' },
  { value: 'Raleigh', label: '📍 Raleigh' },
];

const HOTNESS_OPTIONS: { value: FilterState['hotness']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'popular', label: '🔥 Popular' },
  { value: 'deep-cut', label: '💎 Deep Cut' },
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
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Location */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted">Location:</span>
            {LOCATION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onLocationChange(opt.value)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                  filters.location === opt.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Topics */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted">Vibe:</span>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => onTopicToggle(cat.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                  filters.topics.includes(cat.id)
                    ? `${cat.badgeClass} ${cat.badgeTextClass} ring-2 ring-offset-1 ring-current shadow-sm`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Hotness + Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted">Hotness:</span>
              {HOTNESS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onHotnessChange(opt.value)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    filters.hotness === opt.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
