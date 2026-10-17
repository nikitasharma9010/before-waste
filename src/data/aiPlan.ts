import { issues, type Decision } from './decisionData.js';

export const PLAN_RESOURCES = {
  compost: { label: 'US EPA: composting at home (US example)', url: 'https://www.epa.gov/recycle/composting-home', note: 'One country’s guidance, not a global standard. Search for your own city or country’s composting rules; home composting also differs from commercial collection.' },
  recycling: { label: 'US EPA: recycling questions (US example)', url: 'https://www.epa.gov/recycle/frequent-questions-recycling', note: 'Recycling rules vary by country and even by city. Check your local collector directly; a recycling symbol is not a guarantee.' },
  food: { label: 'US EPA: sustainable management of food (US example)', url: 'https://www.epa.gov/sustainable-management-food', note: 'One country’s guidance, not a global standard. Prioritize preventing wasted food. Do not assess food safety from a description.' },
  clothing: { label: 'iFixit clothing guides', url: 'https://www.ifixit.com/Device/Clothing', note: 'Free, international repair guides. Match fabric, fault, tools and difficulty before repair.' },
  headphones: { label: 'iFixit headphone guides', url: 'https://www.ifixit.com/Device/Headphone', note: 'Free, international repair guides. Model-specific; not every model is repairable by its owner.' },
  reuse: { label: 'US EPA: reuse and donation (US example)', url: 'https://www.epa.gov/recycle/what-you-can-do', note: 'One country’s guidance, not a global standard. Check local acceptance and fees directly wherever you are.' },
  electronics: { label: 'US EPA: electronics collection (US example)', url: 'https://www.epa.gov/recycle/electronics-donation-and-recycling', note: 'One country’s guidance, not a global standard. Confirm electronics and battery collection options with your own municipality or the manufacturer.' },
  community: { label: 'Repair Café directory', url: 'https://www.repaircafe.org/en/visit/', note: 'An international volunteer network. Coverage, times, charges and accepted repairs vary — contact the group first.' },
  circular: { label: 'Ellen MacArthur Foundation: what is a circular economy', url: 'https://ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview', note: 'A general, country-neutral explainer of reduce/reuse/recycle thinking — a reasonable starting point wherever you are.' },
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
export interface PlannerContext { question: string; answer: string }
export interface PlannerRequest extends Decision { description: string; location?: string; context?: PlannerContext[] }

const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const shortText = (v: unknown, max: number): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= max && !/https?:\/\/|www\./i.test(v);
const texts = (v: unknown, max: number): v is string[] => Array.isArray(v) && v.length <= max && v.every(x => shortText(x, 500));
// The app owns presentation; providers supply short plain-text fields only.
function normalizePlanText(value: string): string {
  return value.replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*(?:[-*+\u2022]\s+|\d+[.)]\s+)/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1').replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1').replace(/\s+/g, ' ').trim();
}
const unsupportedFormatting = (value: string) => /```|<\/?[a-z][^>]*>|^\s*\|.+\|/im.test(value);
export function parsePlan(v: unknown): AIPlan | null {
  if (!record(v) || (v.status !== 'ready' && v.status !== 'clarify' && v.status !== 'unsupported') ||
    !shortText(v.summary, 600) || !shortText(v.action, 200) || !shortText(v.reason, 600) ||
    !shortText(v.alternative, 600) || !texts(v.steps, 3) || !texts(v.questions, 2) ||
    !Array.isArray(v.resourceIds) || v.resourceIds.length > 3 ||
    !v.resourceIds.every(id => typeof id === 'string' && Object.hasOwn(PLAN_RESOURCES, id)) ||
    (v.status === 'ready' && v.steps.length === 0) ||
    (v.status !== 'ready' && v.steps.length !== 0) || (v.status === 'clarify' && v.questions.length === 0)) return null;
  const rawFields = [v.action, v.summary, v.reason, v.alternative, ...v.steps, ...v.questions] as string[];
  if (rawFields.some(unsupportedFormatting)) return null;
  const normalized = rawFields.map(normalizePlanText);
  if (normalized.some(text => !text)) return null;
  return { status: v.status as AIPlan['status'], action: normalized[0], summary: normalized[1], reason: normalized[2],
    alternative: normalized[3], steps: normalized.slice(4, 4 + v.steps.length), questions: normalized.slice(4 + v.steps.length),
    resourceIds: [...new Set(v.resourceIds)] } as AIPlan;
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
    (v.location !== undefined && (typeof v.location !== 'string' || v.location.length > 120)) ||
    typeof v.description !== 'string' || v.description.trim().length < 10 || v.description.length > 1500 ||
    ((v.item === 'anything') !== (v.intent === 'explore')) ||
    (v.issue !== undefined && !issues[v.item].some(i => i.id === v.issue))) return null;
  if (v.context !== undefined && (!Array.isArray(v.context) || v.context.length > 2 || !v.context.every(turn => record(turn) && typeof turn.question === 'string' && turn.question.length <= 1700 && typeof turn.answer === 'string' && turn.answer.length <= 1000))) return null;
  return { ...(Array.isArray(v.context) ? { context: v.context.map(turn => ({ question: turn.question, answer: turn.answer })) } : {}), item: v.item, intent: v.intent, support: v.support, budget: v.budget,
    issue: v.issue as PlannerRequest['issue'], description: v.description.trim(), ...(typeof v.location === 'string' && v.location.trim() ? { location: v.location.trim() } : {}) };
}
export const PLAN_LABELS = { reason: 'Why this fits', steps: 'Suggested steps', alternative: 'Another option', questions: 'Details to clarify', resources: 'Resources to check' } as const;
export function planText(plan: AIPlan): string {
  return [plan.action, plan.summary, `${PLAN_LABELS.reason}: ${plan.reason}`, ...(plan.steps.length ? [PLAN_LABELS.steps] : []), ...plan.steps.map((s, i) => `${i + 1}. ${s}`),
    `${PLAN_LABELS.alternative}: ${plan.alternative}`, ...(plan.questions.length ? [PLAN_LABELS.questions, ...plan.questions] : []),
    ...(plan.resourceIds.length ? [PLAN_LABELS.resources] : []), ...plan.resourceIds.map(id => `${PLAN_RESOURCES[id].label}: ${PLAN_RESOURCES[id].url}`)].join('\n\n');
}
