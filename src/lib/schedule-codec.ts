export function encodeSchedule(selectedIds: string[]): string {
  if (selectedIds.length === 0) return '';
  return btoa(selectedIds.join(','));
}

export function decodeSchedule(encoded: string): string[] {
  if (!encoded) return [];
  try {
    return atob(encoded).split(',').filter(Boolean);
  } catch {
    return [];
  }
}
