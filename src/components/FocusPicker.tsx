'use client';

import { FocusPreference } from '@/types';

interface FocusPickerProps {
  onSelect: (focus: FocusPreference) => void;
}

const FOCUS_OPTIONS: {
  value: Exclude<FocusPreference, 'all'>;
  emoji: string;
  title: string;
  subtitle: string;
}[] = [
  {
    value: 'product',
    emoji: '🛠️',
    title: 'Product & Tech',
    subtitle: 'Building, shipping, AI tools',
  },
  {
    value: 'strategy',
    emoji: '🧠',
    title: 'Strategy & Growth',
    subtitle: 'Fundraising, scaling, pivoting',
  },
  {
    value: 'revenue',
    emoji: '💰',
    title: 'Sales & Revenue',
    subtitle: 'Customers, leads, closing deals',
  },
];

export default function FocusPicker({ onSelect }: FocusPickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            What matters most to you this week?
          </h2>
          <p className="mt-2 text-sm text-muted">
            We'll highlight your best-match sessions in every time slot.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {FOCUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="flex flex-col items-center rounded-xl border-2 border-card-border bg-white p-6 text-center transition-all hover:border-primary hover:shadow-lg hover:scale-[1.02]"
            >
              <span className="text-4xl">{opt.emoji}</span>
              <span className="mt-3 font-heading text-lg font-bold text-foreground">
                {opt.title}
              </span>
              <span className="mt-1 text-sm text-muted">
                {opt.subtitle}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onSelect('all')}
            className="text-sm text-muted hover:text-primary hover:underline"
          >
            Skip — show me the best of each
          </button>
        </div>
      </div>
    </div>
  );
}
