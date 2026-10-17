import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateCompletedDays,
  validateNotes,
  loadCompletedDays,
  loadNotes,
  saveCompletedDays,
  saveNotes,
  clearPauseData,
  STORAGE_KEY_COMPLETED,
  STORAGE_KEY_NOTES
} from '../utils/storage';

describe('Storage Validation & Recovery', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('validateCompletedDays', () => {
    it('accepts valid unique days 1 through 7 and sorts them', () => {
      const result = validateCompletedDays([5, 1, 3]);
      expect(result).toEqual([1, 3, 5]);
    });

    it('deduplicates duplicate day entries', () => {
      const result = validateCompletedDays([2, 2, 2, 4]);
      expect(result).toEqual([2, 4]);
    });

    it('filters out invalid numbers, negative numbers, and out-of-range numbers', () => {
      const result = validateCompletedDays([0, 1, 8, -5, 3.5, 7, 100]);
      expect(result).toEqual([1, 7]);
    });

    it('recovers gracefully from non-array or corrupt shapes', () => {
      expect(validateCompletedDays(null)).toEqual([]);
      expect(validateCompletedDays(undefined)).toEqual([]);
      expect(validateCompletedDays('1,2,3')).toEqual([]);
      expect(validateCompletedDays({ day: 1 })).toEqual([]);
      expect(validateCompletedDays([null, undefined, 'string', true])).toEqual([]);
    });
  });

  describe('validateNotes', () => {
    it('accepts valid day keys 1 through 7 with non-empty string values', () => {
      const result = validateNotes({
        1: 'Thought about my purchase',
        4: 'Found a vintage jacket'
      });
      expect(result).toEqual({
        1: 'Thought about my purchase',
        4: 'Found a vintage jacket'
      });
    });

    it('ignores empty or whitespace-only notes', () => {
      const result = validateNotes({
        1: '   ',
        2: 'Valid note',
        3: ''
      });
      expect(result).toEqual({
        2: 'Valid note'
      });
    });

    it('ignores invalid keys like negative, out of range, or non-numeric', () => {
      const result = validateNotes({
        0: 'Zero day',
        8: 'Day eight',
        foo: 'Bar',
        3: 'Valid note for day 3'
      });
      expect(result).toEqual({
        3: 'Valid note for day 3'
      });
    });

    it('recovers safely from non-object, null, or array inputs', () => {
      expect(validateNotes(null)).toEqual({});
      expect(validateNotes(undefined)).toEqual({});
      expect(validateNotes([1, 2, 3])).toEqual({});
      expect(validateNotes('some note string')).toEqual({});
    });
  });

  describe('load & save roundtrip and corrupted storage handling', () => {
    it('saves and loads completed days safely', () => {
      saveCompletedDays([1, 3, 7]);
      const { days, isStorageAvailable } = loadCompletedDays();
      expect(isStorageAvailable).toBe(true);
      expect(days).toEqual([1, 3, 7]);
    });

    it('recovers safely when localStorage contains corrupt non-JSON text', () => {
      localStorage.setItem(STORAGE_KEY_COMPLETED, '{invalid_json');
      const { days } = loadCompletedDays();
      expect(days).toEqual([]);
    });

    it('recovers safely when localStorage contains invalid values', () => {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(['bad', 99, -1]));
      const { days } = loadCompletedDays();
      expect(days).toEqual([]);
    });

    it('saves and loads reflection notes safely', () => {
      saveNotes({ 2: 'Borrowed a ladder from neighbor' });
      const { notes } = loadNotes();
      expect(notes).toEqual({ 2: 'Borrowed a ladder from neighbor' });
    });

    it('recovers safely from corrupt notes JSON', () => {
      localStorage.setItem(STORAGE_KEY_NOTES, '<<<not-json>>>');
      const { notes } = loadNotes();
      expect(notes).toEqual({});
    });

    it('clears pause data properly', () => {
      saveCompletedDays([1, 2]);
      saveNotes({ 1: 'Reflected' });
      clearPauseData();
      expect(loadCompletedDays().days).toEqual([]);
      expect(loadNotes().notes).toEqual({});
    });
  });
});
