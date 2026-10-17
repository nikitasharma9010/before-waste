import type { Decision } from '../data/decisionData';
export const ACTION_KEY = 'beforewaste_action_v1';
export type Outcome = 'planned' | 'done' | 'blocked' | 'changed';
export interface SavedAction extends Decision { note: string; outcome: Outcome }
export function readAction(): { action: SavedAction | null; unavailable: boolean } {
  try {
    const raw = localStorage.getItem(ACTION_KEY);
    if (!raw) return { action: null, unavailable: false };
    const d: unknown = JSON.parse(raw);
    if (typeof d !== 'object' || !d) return { action: null, unavailable: false };
    const a = d as Record<string, unknown>;
    if (
      (a.item !== 'clothes' && a.item !== 'headphones') ||
      (a.intent !== 'buy' && a.intent !== 'fix' && a.intent !== 'pass') ||
      (a.support !== 'myself' && a.support !== 'help') ||
      (a.budget !== 'free' && a.budget !== 'flexible') ||
      (a.outcome !== 'planned' && a.outcome !== 'done' && a.outcome !== 'blocked' && a.outcome !== 'changed') ||
      typeof a.note !== 'string'
    ) return { action: null, unavailable: false };
    return { action: { item: a.item, intent: a.intent, support: a.support, budget: a.budget, outcome: a.outcome, note: a.note.slice(0, 1000) }, unavailable: false };
  } catch { return { action: null, unavailable: true }; }
}
export function writeAction(action: SavedAction | null): boolean {
  try {
    if (action) localStorage.setItem(ACTION_KEY, JSON.stringify(action));
    else localStorage.removeItem(ACTION_KEY);
    return true;
  } catch { return false; }
}
