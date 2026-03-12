import { HotnessLevel } from '@/types';

export function computeMedianThreshold(guestCounts: (number | null)[]): number {
  const valid = guestCounts.filter((c): c is number => c !== null).sort((a, b) => a - b);
  if (valid.length === 0) return 0;
  const mid = Math.floor(valid.length / 2);
  return valid.length % 2 === 0
    ? (valid[mid - 1] + valid[mid]) / 2
    : valid[mid];
}

export function classifyHotness(
  guestCount: number | null,
  median: number
): HotnessLevel {
  if (guestCount === null) return null;
  return guestCount > median ? 'popular' : 'deep-cut';
}

export function getHotnessLabel(hotness: HotnessLevel): string {
  switch (hotness) {
    case 'popular': return '🔥 Popular';
    case 'deep-cut': return '💎 Deep Cut';
    default: return '';
  }
}
