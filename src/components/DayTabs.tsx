'use client';

import { DaySchedule } from '@/types';

interface DayTabsProps {
  days: DaySchedule[];
  activeDay: number;
  onDayChange: (index: number) => void;
}

export default function DayTabs({ days, activeDay, onDayChange }: DayTabsProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1">
        {days.map((day, index) => (
          <button
            key={day.date}
            onClick={() => onDayChange(index)}
            className={`flex-1 min-w-[100px] rounded-lg px-3 py-2.5 text-center transition-all ${
              activeDay === index
                ? 'bg-white font-semibold text-foreground shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <div className="font-heading text-sm font-semibold">
              {day.dayLabel.slice(0, 3)}
            </div>
            <div className="text-xs opacity-75">{day.dateLabel}</div>
            <div className="mt-0.5 text-xs opacity-60">{day.city}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
