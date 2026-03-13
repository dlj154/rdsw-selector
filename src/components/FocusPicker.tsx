'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FocusPreference, CityFilter, FilterState } from '@/types';

export interface PickerPrefs {
  focus: FocusPreference;
  location: CityFilter;
  hotness: FilterState['hotness'];
}

interface FocusPickerProps {
  onSelect: (prefs: PickerPrefs) => void;
}

const FOCUS_OPTIONS: {
  value: Exclude<FocusPreference, 'all'>;
  emoji: string;
  title: string;
  subtitle: string;
}[] = [
  { value: 'product', emoji: '🛠️', title: 'Product & Tech', subtitle: 'Building, shipping, AI tools' },
  { value: 'strategy', emoji: '🧠', title: 'Strategy & Growth', subtitle: 'Fundraising, scaling, pivoting' },
  { value: 'revenue', emoji: '💰', title: 'Sales & Revenue', subtitle: 'Customers, leads, closing deals' },
];

const LOCATION_OPTIONS: { value: CityFilter; emoji: string; label: string }[] = [
  { value: 'Raleigh', emoji: '🌆', label: 'Raleigh' },
  { value: 'Durham', emoji: '🏙️', label: 'Durham' },
  { value: 'all', emoji: '🗺️', label: 'Both' },
];

const HOTNESS_OPTIONS: {
  value: FilterState['hotness'];
  emoji: string;
  label: string;
  desc: string;
}[] = [
  { value: 'popular', emoji: '🔥', label: 'Popular', desc: 'High-buzz sessions' },
  { value: 'deep-cut', emoji: '💎', label: 'Deep Cut', desc: 'Hidden gems' },
  { value: 'all', emoji: '🌀', label: 'Any', desc: 'Mix of both' },
];

export default function FocusPicker({ onSelect }: FocusPickerProps) {
  const [focus, setFocusSel] = useState<Exclude<FocusPreference, 'all'> | null>(null);
  const [location, setLocationSel] = useState<CityFilter | null>(null);
  const [hotness, setHotnessSel] = useState<FilterState['hotness'] | null>(null);

  function handleLucky() {
    onSelect({ focus: 'all', location: 'all', hotness: 'popular' });
  }

  function handleConfirm() {
    onSelect({
      focus: focus ?? 'all',
      location: location ?? 'all',
      hotness: hotness ?? 'all',
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm animate-fade-in py-8">
      <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Let's build your week
          </h2>
          <p className="mt-2 text-sm text-muted">
            Tell us what you're into and we'll pick your best sessions.
          </p>
        </div>

        {/* I'm Feeling Lucky */}
        <button
          onClick={handleLucky}
          className="mb-6 w-full rounded-xl bg-amber-400 px-6 py-4 text-center font-heading font-bold text-amber-900 shadow-md transition-all hover:bg-amber-300 hover:shadow-lg hover:scale-[1.01]"
        >
          <span className="text-lg">✨ I'm Feeling Lucky</span>
          <span className="mt-1 block text-xs font-normal text-amber-800">
            Auto-select the most popular sessions for me
          </span>
        </button>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-card-border" />
          <span className="text-xs font-medium text-muted">or personalize below</span>
          <div className="h-px flex-1 bg-card-border" />
        </div>

        {/* Focus */}
        <div className="mb-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            What's your focus?
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {FOCUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFocusSel(focus === opt.value ? null : opt.value)}
                className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all hover:scale-[1.02] ${
                  focus === opt.value
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-card-border bg-white hover:border-primary/50'
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="mt-2 font-heading text-sm font-bold text-foreground">{opt.title}</span>
                <span className="mt-0.5 text-xs text-muted">{opt.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Which city?
          </p>
          <div className="grid grid-cols-3 gap-3">
            {LOCATION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setLocationSel(location === opt.value ? null : opt.value)}
                className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all hover:scale-[1.02] ${
                  location === opt.value
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-card-border bg-white hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="mt-2 font-heading text-sm font-bold text-foreground">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Popularity */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Session popularity?
          </p>
          <div className="grid grid-cols-3 gap-3">
            {HOTNESS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setHotnessSel(hotness === opt.value ? null : opt.value)}
                className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all hover:scale-[1.02] ${
                  hotness === opt.value
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-card-border bg-white hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="mt-2 font-heading text-sm font-bold text-foreground">{opt.label}</span>
                <span className="mt-0.5 text-xs text-muted">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          className="w-full rounded-xl bg-primary px-6 py-4 font-heading text-base font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg"
        >
          Build My Schedule →
        </button>

        {/* InsightStack attribution */}
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted/50">
          Built by{' '}
          <a
            href="https://www.insight-stack.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-muted/70 transition-colors hover:text-primary"
          >
            <Image
              src="/insightstack-logo.png"
              alt="InsightStack"
              height={12}
              width={14}
              className="inline-block"
            />
            InsightStack
          </a>
        </p>
      </div>
    </div>
  );
}
