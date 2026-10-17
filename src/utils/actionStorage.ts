import { issues, type Barrier, type Decision } from '../data/decisionData';
import { parseGeneratedPlan, type GeneratedPlan } from '../data/aiPlan';
export const ACTION_KEY = 'beforewaste_action_v1';
export type Outcome = 'planned' | 'done' | 'blocked' | 'changed';
export interface SavedAction extends Decision { note: string; question?: string; outcome: Outcome; barrier?: Barrier; customPlan?: GeneratedPlan & { text: string } }
export function readAction(): { action: SavedAction | null; unavailable: boolean } {
  try {
    const raw = localStorage.getItem(ACTION_KEY);
    if (!raw) return { action: null, unavailable: false };
    const d: unknown = JSON.parse(raw);
    if (typeof d !== 'object' || !d) return { action: null, unavailable: false };
    const a = d as Record<string, unknown>;
    if (
      (a.item !== 'clothes' && a.item !== 'headphones' && a.item !== 'anything') ||
      (a.intent !== 'buy' && a.intent !== 'fix' && a.intent !== 'pass' && a.intent !== 'explore') ||
      (a.support !== 'myself' && a.support !== 'help') ||
      (a.budget !== 'free' && a.budget !== 'flexible') ||
      (a.outcome !== 'planned' && a.outcome !== 'done' && a.outcome !== 'blocked' && a.outcome !== 'changed') ||
      typeof a.note !== 'string'
    ) return { action: null, unavailable: false };
    const issue = issues[a.item].find(i => i.id === a.issue)?.id ?? 'unsure';
    const barrier = a.barrier === 'cost' || a.barrier === 'time' || a.barrier === 'tools' || a.barrier === 'access' ? a.barrier : undefined;
    const storedPlan = a.customPlan && typeof a.customPlan === 'object' ? a.customPlan as Record<string, unknown> : null;
    const generated = parseGeneratedPlan(storedPlan);
    // Never silently replace a corrupt generated plan with an unrelated editorial action.
    if (a.customPlan !== undefined && (!generated || typeof storedPlan?.text !== 'string' || !storedPlan.text.trim() || storedPlan.text.length > 6000)) return { action: null, unavailable: true };
    const customPlan = generated && storedPlan && typeof storedPlan.text === 'string' ? { ...generated, text: storedPlan.text } : undefined;
    return { action: { item: a.item, intent: a.intent, support: a.support, budget: a.budget, issue, barrier, customPlan, ...(typeof a.question === 'string' ? { question: a.question.slice(0, 1700) } : {}), outcome: a.outcome, note: a.note.slice(0, 1000) }, unavailable: false };
  } catch { return { action: null, unavailable: true }; }
}
export function writeAction(action: SavedAction | null): boolean {
  try {
    if (action) localStorage.setItem(ACTION_KEY, JSON.stringify(action));
    else localStorage.removeItem(ACTION_KEY);
    return true;
  } catch { return false; }
}
