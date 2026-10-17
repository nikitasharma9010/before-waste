import { beforeEach, expect, it, vi } from 'vitest';
import { ANSWERS_KEY, readSavedAnswers, writeSavedAnswers } from '../utils/savedAnswers';
import { ACTION_KEY } from '../utils/actionStorage';
beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
it('migrates the earlier action and preserves its notes without deleting the old key', () => {
  localStorage.setItem(ACTION_KEY, JSON.stringify({ item: 'clothes', intent: 'buy', support: 'myself', budget: 'free', note: 'Keep this note', outcome: 'done' }));
  const migrated = readSavedAnswers();
  expect(migrated.answers[0].legacyNote).toBe('Keep this note');
  expect(migrated.answers[0].legacyOutcome).toBe('done');
  expect(writeSavedAnswers(migrated.answers)).toBe(true);
  expect(localStorage.getItem(ACTION_KEY)).not.toBeNull();
  writeSavedAnswers([]);
  expect(readSavedAnswers().answers).toEqual([]);
});
it('persists multiple answers independently', () => {
  const answers = ['one', 'two'].map(id => ({ id, question: `Question ${id}`, text: `Answer ${id}`, createdAt: 123 }));
  writeSavedAnswers(answers);
  expect(readSavedAnswers().answers).toEqual(answers);
  writeSavedAnswers(answers.slice(1));
  expect(readSavedAnswers().answers).toEqual([answers[1]]);
});
it('reports corrupt collections and quota failures without deleting stored data', () => {
  localStorage.setItem(ANSWERS_KEY, 'unreadable');
  expect(readSavedAnswers().unavailable).toBe(true);
  expect(localStorage.getItem(ANSWERS_KEY)).toBe('unreadable');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  expect(writeSavedAnswers([])).toBe(false);
  expect(localStorage.getItem(ANSWERS_KEY)).toBe('unreadable');
});
