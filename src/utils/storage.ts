/**
 * Safe localStorage utilities with strict schema validation and error recovery.
 */

export const STORAGE_KEY_COMPLETED = 'beforewaste_completed_days_v1';
export const STORAGE_KEY_NOTES = 'beforewaste_day_notes_v1';

/**
 * Validates that data is an array of unique integers from 1 to 7.
 */
export function validateCompletedDays(data: unknown): number[] {
  if (!Array.isArray(data)) {
    return [];
  }
  const validDays = new Set<number>();
  for (const item of data) {
    if (typeof item === 'number' && Number.isInteger(item) && item >= 1 && item <= 7) {
      validDays.add(item);
    }
  }
  return Array.from(validDays).sort((a, b) => a - b);
}

/**
 * Validates that data is a record mapping day numbers 1..7 to string values.
 */
export function validateNotes(data: unknown): Record<number, string> {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {};
  }
  const validNotes: Record<number, string> = {};
  for (const [key, value] of Object.entries(data)) {
    const dayNum = Number(key);
    if (Number.isInteger(dayNum) && dayNum >= 1 && dayNum <= 7 && typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        validNotes[dayNum] = value;
      }
    }
  }
  return validNotes;
}

/**
 * Safely reads completed days from localStorage with validation.
 */
export function loadCompletedDays(): { days: number[]; isStorageAvailable: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
    if (!raw) return { days: [], isStorageAvailable: true };
    const parsed = JSON.parse(raw);
    return { days: validateCompletedDays(parsed), isStorageAvailable: true };
  } catch {
    return { days: [], isStorageAvailable: checkStorageAvailable() };
  }
}

/**
 * Safely reads notes from localStorage with validation.
 */
export function loadNotes(): { notes: Record<number, string>; isStorageAvailable: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) return { notes: {}, isStorageAvailable: true };
    const parsed = JSON.parse(raw);
    return { notes: validateNotes(parsed), isStorageAvailable: true };
  } catch {
    return { notes: {}, isStorageAvailable: checkStorageAvailable() };
  }
}

/**
 * Safely writes completed days to localStorage.
 * Returns true if saved, false if failed.
 */
export function saveCompletedDays(days: number[]): boolean {
  try {
    const valid = validateCompletedDays(days);
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(valid));
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely writes notes to localStorage.
 * Returns true if saved, false if failed.
 */
export function saveNotes(notes: Record<number, string>): boolean {
  try {
    const valid = validateNotes(notes);
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(valid));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears saved pause data from localStorage.
 */
export function clearPauseData(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY_COMPLETED);
    localStorage.removeItem(STORAGE_KEY_NOTES);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if localStorage is functional (handles private mode / blocked storage).
 */
export function checkStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
