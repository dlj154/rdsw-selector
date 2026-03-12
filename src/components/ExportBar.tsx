'use client';

import { useState } from 'react';
import { encodeSchedule } from '@/lib/schedule-codec';

interface ExportBarProps {
  selectedCount: number;
  totalSlots: number;
  selectedEventIds: string[];
}

export default function ExportBar({
  selectedCount,
  totalSlots,
  selectedEventIds,
}: ExportBarProps) {
  const [copied, setCopied] = useState(false);

  if (selectedCount === 0) return null;

  const handleShare = async () => {
    const encoded = encodeSchedule(selectedEventIds);
    const url = `${window.location.origin}/schedule/${encoded}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text in a temporary input
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-card-border bg-white/95 backdrop-blur-sm shadow-lg shadow-black/5">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="text-sm">
          <span className="font-heading font-bold text-primary">{selectedCount}</span>
          <span className="text-muted"> of {totalSlots} sessions picked</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {copied ? '✓ Copied!' : '🔗 Share Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
}
