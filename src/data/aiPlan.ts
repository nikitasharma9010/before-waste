import { issues, type Decision } from './decisionData.js';

export const PLAN_RESOURCES = {
  compost: { label: 'US EPA: composting at home (US guidance)', url: 'https://www.epa.gov/recycle/composting-home', note: 'Home composting differs from commercial collection; check accepted materials for your system.' },
  recycling: { label: 'US EPA: recycling questions (US guidance)', url: 'https://www.epa.gov/recycle/frequent-questions-recycling', note: 'Acceptance varies by local program. Check your collector directly; a recycling symbol is not a guarantee.' },
  food: { label: 'US EPA: sustainable management of food (US guidance)', url: 'https://www.epa.gov/sustainable-management-food', note: 'Prioritize preventing wasted food. Do not assess food safety from a description.' },
  clothing: { label: 'iFixit clothing guides', url: 'https://www.ifixit.com/Device/Clothing', note: 'Match fabric, fault, tools and difficulty before repair.' },
  headphones: { label: 'iFixit headphone guides', url: 'https://www.ifixit.com/Device/Headphone', note: 'Model-specific guides; not every model is repairable by its owner.' },
  reuse: { label: 'US EPA: reuse and donation (US guidance)', url: 'https://www.epa.gov/recycle/what-you-can-do', note: 'Background guidance. Check local acceptance and fees directly.' },
  electronics: { label: 'US EPA: electronics collection (US guidance)', url: 'https://www.epa.gov/recycle/electronics-donation-and-recycling', note: 'Confirm electronics and battery collection options directly with your municipality or manufacturer.' },
  community: { label: 'Repair Café directory', url: 'https://www.repaircafe.org/en/visit/', note: 'Coverage, times, charges and accepted repairs vary. Contact the group first.' },
} as const;
export type ResourceId = keyof typeof PLAN_RESOURCES;
export interface AIPlan {
  status: 'ready' | 'clarify' | 'unsupported';
  summary: string;
  action: string;
  reason: string;
  steps: string[];
  alternative: string;
  questions: string[];
  resourceIds: ResourceId[];
}
export interface GeneratedPlan { plan: AIPlan; source: 'ai' | 'safety'; model: string; provider?: 'gemini' | 'aicredits' }
export interface PlannerRequest extends Decision { description: string }

const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const shortText = (v: unknown, max: number): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= max && !/https?:\/\/|www\./i.test(v);
const texts = (v: unknown, max: number): v is string[] => Array.isArray(v) && v.length <= max && v.every(x => shortText(x, 500));
export function parsePlan(v: unknown): AIPlan | null {
  if (!record(v) || (v.status !== 'ready' && v.status !== 'clarify' && v.status !== 'unsupported') ||
    !shortText(v.summary, 600) || !shortText(v.action, 200) || !shortText(v.reason, 600) ||
    !shortText(v.alternative, 600) || !texts(v.steps, 3) || !texts(v.questions, 2) ||
    !Array.isArray(v.resourceIds) || v.resourceIds.length > 3 ||
    !v.resourceIds.every(id => typeof id === 'string' && Object.hasOwn(PLAN_RESOURCES, id)) ||
    (v.status === 'ready' && v.steps.length === 0) ||
    (v.status !== 'ready' && v.steps.length !== 0) || (v.status === 'clarify' && v.questions.length === 0)) return null;
  return { status: v.status as AIPlan['status'], summary: v.summary, action: v.action, reason: v.reason,
    steps: [...v.steps], alternative: v.alternative, questions: [...v.questions], resourceIds: [...new Set(v.resourceIds)] } as AIPlan;
}
export function parseGeneratedPlan(v: unknown): GeneratedPlan | null {
  if (!record(v) || (v.source !== 'ai' && v.source !== 'safety') || typeof v.model !== 'string' || v.model.length > 100) return null;
  if (v.provider !== undefined && v.provider !== 'gemini' && v.provider !== 'aicredits') return null;
  const plan = parsePlan(v.plan);
  return plan ? { plan, source: v.source, model: v.model, ...(v.provider ? { provider: v.provider } : {}) } : null;
}
export function parsePlannerRequest(v: unknown): PlannerRequest | null {
  if (!record(v)) return null;
  if (v.item === undefined && v.intent === undefined && v.support === undefined && v.budget === undefined && v.issue === undefined) {
    v = { ...v, item: 'anything', intent: 'explore', support: 'myself', budget: 'free' };
  }
  if (!record(v) || (v.item !== 'clothes' && v.item !== 'headphones' && v.item !== 'anything') ||
    (v.intent !== 'buy' && v.intent !== 'fix' && v.intent !== 'pass' && v.intent !== 'explore') ||
    (v.support !== 'myself' && v.support !== 'help') || (v.budget !== 'free' && v.budget !== 'flexible') ||
    typeof v.description !== 'string' || v.description.trim().length < 10 || v.description.length > 1500 ||
    ((v.item === 'anything') !== (v.intent === 'explore')) ||
    (v.issue !== undefined && !issues[v.item].some(i => i.id === v.issue))) return null;
  return { item: v.item, intent: v.intent, support: v.support, budget: v.budget,
    issue: v.issue as PlannerRequest['issue'], description: v.description.trim() };
}
export function planText(plan: AIPlan): string {
  return [plan.action, plan.summary, `Why: ${plan.reason}`, ...plan.steps.map((s, i) => `${i + 1}. ${s}`),
    `Alternative: ${plan.alternative}`, ...plan.questions.map(q => `Question: ${q}`),
    ...plan.resourceIds.map(id => `${PLAN_RESOURCES[id].label}: ${PLAN_RESOURCES[id].url}`)].join('\n\n');
}
