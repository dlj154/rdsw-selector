import Image from 'next/image';
import { fetchEvents } from '@/lib/luma-api';
import { groupIntoSchedule } from '@/lib/time-slots';
import { decodeSchedule } from '@/lib/schedule-codec';
import { EnrichedEvent } from '@/types';
import { getHotnessLabel } from '@/lib/hotness';

export const revalidate = 3600;

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function SharedEventCard({ event }: { event: EnrichedEvent }) {
  const hotnessLabel = getHotnessLabel(event.hotness);

  return (
    <div className="rounded-xl border-2 border-card-border bg-card p-4">
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

      <h3 className="font-heading text-base font-semibold text-foreground">
        {event.title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span>📍 {event.venue}, {event.city}</span>
        <span>🕐 {formatTime(event.startAt)}–{formatTime(event.endAt)}</span>
      </div>

      <div className="mt-3">
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          Register ↗
        </a>
      </div>
    </div>
  );
}

export default async function SharedSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const selectedIds = decodeSchedule(id);

  if (selectedIds.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="font-heading text-xl text-muted">No sessions selected</p>
          <a href="/" className="mt-4 inline-block text-primary hover:underline">
            Build your own schedule →
          </a>
        </div>
      </div>
    );
  }

  const events = await fetchEvents();
  const selectedEvents = events.filter(e => selectedIds.includes(e.id));

  // Group by date
  const byDate = new Map<string, EnrichedEvent[]>();
  for (const event of selectedEvents) {
    const dateKey = formatDate(event.startAt);
    const existing = byDate.get(dateKey) || [];
    existing.push(event);
    byDate.set(dateKey, existing);
  }

  // Sort events within each day by start time
  for (const events of byDate.values()) {
    events.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-br from-primary to-primary-dark py-8 text-center text-white">
        <p className="text-sm font-medium uppercase tracking-widest opacity-80">
          Shared Schedule
        </p>
        <h1 className="font-heading text-3xl font-bold">
          My RDSW 2026 Picks
        </h1>
        <p className="mt-2 text-sm opacity-75">
          {selectedEvents.length} session{selectedEvents.length !== 1 ? 's' : ''} selected
        </p>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs opacity-60">
          Built with{' '}
          <a
            href="https://www.insight-stack.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold opacity-100 underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/insightstack-logo.png"
              alt="InsightStack"
              height={14}
              width={17}
              className="inline-block"
            />
            InsightStack
          </a>
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {Array.from(byDate.entries()).map(([dateLabel, dayEvents]) => (
          <div key={dateLabel} className="mb-8">
            <h2 className="font-heading mb-4 text-lg font-bold text-foreground">
              {dateLabel}
            </h2>
            <div className="space-y-3">
              {dayEvents.map(event => (
                <SharedEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Build Your Own Schedule →
          </a>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted/60">
            Tool built by{' '}
            <a
              href="https://www.insight-stack.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-muted/80 transition-colors hover:text-primary"
            >
              <Image
                src="/insightstack-logo.png"
                alt="InsightStack"
                height={14}
                width={17}
                className="inline-block"
              />
              InsightStack
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
