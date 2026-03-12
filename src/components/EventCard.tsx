'use client';

import { EnrichedEvent } from '@/types';
import { getHotnessLabel } from '@/lib/hotness';

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// ─── Featured card (recommended / selected) ──────────────────────────────────

interface FeaturedCardProps {
  event: EnrichedEvent;
  isAutoRecommended: boolean;
  isManualOverride: boolean;
  onRevertToAuto?: () => void;
}

export function FeaturedCard({
  event,
  isAutoRecommended,
  isManualOverride,
  onRevertToAuto,
}: FeaturedCardProps) {
  const hotnessLabel = getHotnessLabel(event.hotness);

  return (
    <div className={`relative flex flex-col rounded-xl border-2 border-card-selected-border bg-card-selected shadow-md shadow-primary/10 ${event.isNetworking ? 'border-dashed' : ''}`}>
      {/* Recommendation label */}
      <div className="flex items-center justify-between px-4 pt-2.5">
        <span className="text-xs font-semibold text-primary">
          {isAutoRecommended ? '✨ Best match' : '✓ Your pick'}
        </span>
        {isManualOverride && onRevertToAuto && (
          <button
            onClick={onRevertToAuto}
            className="text-xs text-muted hover:text-primary hover:underline"
          >
            ↩ Auto-pick
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-3 pt-2">
        {/* Category + hotness row */}
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
        <h3 className="font-heading text-sm font-semibold leading-snug text-foreground">
          {event.title}
        </h3>

        {/* Meta */}
        <div className="mt-auto pt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span>📍 {event.venue}</span>
          <span>🕐 {formatTime(event.startAt)}–{formatTime(event.endAt)}</span>
          {event.guestCount !== null && <span>👥 {event.guestCount}</span>}
        </div>

        {event.isSoldOut && (
          <div className="mt-2 rounded-md bg-red-50 px-2 py-1 text-center text-xs font-semibold text-red-700">
            Sold Out
          </div>
        )}
      </div>

      {/* Register button */}
      <div className="border-t border-card-selected-border/50">
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full py-2.5 text-center text-sm font-semibold transition-colors rounded-b-xl ${
            event.isSoldOut
              ? 'pointer-events-none text-gray-300'
              : 'text-primary hover:bg-primary/5'
          }`}
        >
          Register ↗
        </a>
      </div>
    </div>
  );
}

// ─── Compact alternative card ─────────────────────────────────────────────────

interface CompactCardProps {
  event: EnrichedEvent;
  onSwitch: () => void;
}

export function CompactCard({ event, onSwitch }: CompactCardProps) {
  const hotnessLabel = getHotnessLabel(event.hotness);

  return (
    <div className="flex items-start gap-2 rounded-lg border border-card-border bg-white px-3 py-2.5 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="min-w-0 flex-1">
        {/* Category + hotness */}
        <div className="mb-0.5 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${event.category.badgeClass} ${event.category.badgeTextClass}`}
          >
            {event.category.emoji}
          </span>
          {hotnessLabel && (
            <span className="text-[10px] text-muted">{hotnessLabel}</span>
          )}
        </div>

        {/* Title (2-line clamp) */}
        <p className="line-clamp-2 text-xs font-medium leading-tight text-foreground">
          {event.title}
        </p>

        {/* Venue + time */}
        <p className="mt-0.5 truncate text-[10px] text-muted">
          {event.venue} · {formatTime(event.startAt)}
        </p>
      </div>

      <button
        onClick={onSwitch}
        className="mt-0.5 shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-primary hover:text-white transition-colors"
      >
        Switch
      </button>
    </div>
  );
}

// Legacy default export (used in shareable schedule page)
export default function EventCard({
  event,
  isSelected,
  onSelect,
}: {
  event: EnrichedEvent;
  isSelected: boolean;
  onSelect: () => void;
}) {
  if (isSelected) {
    return (
      <FeaturedCard
        event={event}
        isAutoRecommended={false}
        isManualOverride={true}
        onRevertToAuto={onSelect}
      />
    );
  }
  return <CompactCard event={event} onSwitch={onSelect} />;
}
