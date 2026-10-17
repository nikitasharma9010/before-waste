import { recommend } from '../data/decisionData';
import { readAction } from './actionStorage';
export const ANSWERS_KEY = 'beforewaste_saved_answers_v2';
export interface SavedAnswer { id: string; question: string; text: string; createdAt: number; legacyNote?: string; legacyOutcome?: string; }
export function readSavedAnswers(): { answers: SavedAnswer[]; unavailable: boolean } {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    if (raw !== null) {
      const data = JSON.parse(raw);
      if (data?.version !== 2 || !Array.isArray(data.answers) || data.answers.length > 100 || !data.answers.every((a: SavedAnswer) => a && typeof a.id === 'string' && !!a.id && typeof a.question === 'string' && a.question.length <= 1700 && typeof a.text === 'string' && !!a.text.trim() && a.text.length <= 6000 && Number.isFinite(a.createdAt) && (a.legacyNote === undefined || typeof a.legacyNote === 'string') && (a.legacyOutcome === undefined || typeof a.legacyOutcome === 'string')) || new Set(data.answers.map((a: SavedAnswer) => a.id)).size !== data.answers.length) throw new Error('Invalid saved collection');
      return { answers: data.answers, unavailable: false };
    }
    const legacy = readAction();
    if (!legacy.action) return { answers: [], unavailable: legacy.unavailable };
    const action = legacy.action;
    const advice = recommend(action);
    return { answers: [{ id: 'legacy-action', question: action.question ?? '', text: action.customPlan?.text ?? `${advice.title}\n\n${advice.step}\n\n${advice.resource.url}`, createdAt: 0, legacyNote: action.note, legacyOutcome: action.outcome + (action.barrier ? ` (${action.barrier})` : '') }], unavailable: false };
  } catch { return { answers: [], unavailable: true }; }
}
export function writeSavedAnswers(answers: SavedAnswer[]): boolean {
  try { localStorage.setItem(ANSWERS_KEY, JSON.stringify({ version: 2, answers })); return true; } catch { return false; }
}
