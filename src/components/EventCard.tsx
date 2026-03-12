'use client';

import { EnrichedEvent } from '@/types';
import { getHotnessLabel } from '@/lib/hotness';

interface EventCardProps {
  event: EnrichedEvent;
  isSelected: boolean;
  onSelect: () => void;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function EventCard({ event, isSelected, onSelect }: EventCardProps) {
  const hotnessLabel = getHotnessLabel(event.hotness);

  return (
    <div
      className={`group relative flex flex-col rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-card-selected-border bg-card-selected shadow-md shadow-primary/10'
          : 'border-card-border bg-card hover:border-gray-300 hover:shadow-sm'
      } ${event.isNetworking ? 'border-dashed' : ''}`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs shadow-sm">
          ✓
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        {/* Top row: category badge + hotness */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${event.category.badgeClass} ${event.category.badgeTextClass}`}
          >
            {event.category.emoji} {event.category.label}
          </span>
          {hotnessLabel && (
            <span className="text-xs font-medium text-muted">{hotnessLabel}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading text-sm font-semibold leading-snug text-foreground sm:text-base">
          {event.title}
        </h3>

        {/* Meta row */}
        <div className="mt-auto pt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span>📍 {event.venue}</span>
          <span>
            🕐 {formatTime(event.startAt)}–{formatTime(event.endAt)}
          </span>
          {event.guestCount !== null && (
            <span>👥 {event.guestCount}</span>
          )}
        </div>

        {/* Sold out badge */}
        {event.isSoldOut && (
          <div className="mt-2 rounded-md bg-red-50 px-2 py-1 text-center text-xs font-semibold text-red-700">
            Sold Out
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex border-t border-card-border">
        <button
          onClick={onSelect}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            isSelected
              ? 'text-primary hover:bg-primary/5'
              : 'text-muted hover:bg-gray-50 hover:text-foreground'
          }`}
        >
          {isSelected ? '✓ Selected' : 'Select'}
        </button>
        <div className="w-px bg-card-border" />
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 px-4 py-2.5 text-center text-sm font-medium transition-colors ${
            event.isSoldOut
              ? 'pointer-events-none text-gray-300'
              : 'text-primary hover:bg-primary/5'
          }`}
          tabIndex={event.isSoldOut ? -1 : 0}
        >
          Register ↗
        </a>
      </div>
    </div>
  );
}
