import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DecisionHelper } from '../components/DecisionHelper';
import { readAction } from '../utils/actionStorage';
import type { GeneratedPlan } from '../data/aiPlan';

const generated: GeneratedPlan = { source: 'ai', model: 'gemini-3.8-flash', plan: { status: 'ready', summary: 'A loose button on your coat needs attention.', action: 'Check for a spare button', reason: 'You want to start without spending.', steps: ['Look in the care-label pouch for a spare button.'], alternative: 'Ask someone who sews whether they have a suitable spare.', questions: [], resourceIds: ['clothing'] } };
let host: HTMLDivElement;
let root: Root;
beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }); localStorage.clear();
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => { fn(0); return 0; });
  await act(async () => root.render(<DecisionHelper onExploreObject={() => {}} />));
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
async function input(id: string, value: string) {
  const el = host.querySelector<HTMLTextAreaElement>(`#${id}`)!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function click(text: string) {
  const button = [...host.querySelectorAll('button')].find(b => b.textContent?.includes(text));
  if (!button) throw new Error(`Missing ${text}`);
  await act(async () => button.click());
}
it('generates, edits and saves the actual accepted plan across reload without another model call', async () => {
  const request = vi.fn().mockResolvedValue(Response.json(generated)); vi.stubGlobal('fetch', request);
  await input('ai-description', 'My coat button is loose. I want to use supplies I already have.');
  await click('Generate AI plan');
  expect(host.textContent).toContain('AI-GENERATED DRAFT');
  await input('reviewed-plan', 'My edited plan: ask a friend for a matching spare button.');
  await click('Save this action');
  expect(readAction().action?.customPlan?.text).toContain('My edited plan');
  await act(async () => root.unmount()); root = createRoot(host);
  await act(async () => root.render(<DecisionHelper onExploreObject={() => {}} />));
  expect(host.querySelector('#saved-action')?.textContent).toContain('My edited plan');
  expect(request).toHaveBeenCalledTimes(1);
  const requestBody = JSON.parse(request.mock.calls[0][1].body);
  expect(requestBody.note).toBeUndefined();
});
it('shows honest basic guidance when the AI service is not configured', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'AI planning is not configured yet.' }, { status: 503 })));
  await input('ai-description', 'A coat button is loose and I do not know where to start.'); await click('Generate AI plan');
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('not configured');
  expect(host.textContent).toContain('BASIC GUIDANCE · NOT AI GENERATED');
  expect(host.textContent).not.toContain('AI-GENERATED DRAFT');
});
it('asks for clarification and does not allow saving an unready AI draft', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ...generated, plan: { ...generated.plan, status: 'clarify', steps: [], questions: ['Is the fabric torn or just the stitching?'] } })));
  await input('ai-description', 'There is something wrong with my favourite coat near the shoulder.'); await click('Generate AI plan');
  expect(host.textContent).toContain('Is the fabric torn');
  expect([...host.querySelectorAll('button')].some(b => b.textContent?.includes('Save this action'))).toBe(false);
});
it('discards stale AI output after a form selection changes', async () => {
  await click('Use guided examples');
  let complete!: (value: Response) => void;
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise<Response>(resolve => { complete = resolve; })));
  await input('ai-description', 'A coat button is loose and I have no sewing supplies.'); await click('Generate AI plan');
  const select = host.querySelector('select')!;
  await act(async () => { select.value = 'headphones'; select.dispatchEvent(new Event('change', { bubbles: true })); });
  await act(async () => complete(Response.json(generated)));
  expect(host.textContent).not.toContain('AI-GENERATED DRAFT');
});
it('keeps basic guidance usable with an unfinished optional AI description', async () => {
  await input('ai-description', 'short'); await click('Find my next step');
  expect(host.textContent).toContain('BASIC GUIDANCE · NOT AI GENERATED');
  expect(host.querySelector('#ai-description')?.hasAttribute('minlength')).toBe(false);
});

it('discloses AICredits and retains provider provenance with a saved plan', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ...generated, model: 'openai/gpt-4o-mini', provider: 'aicredits' })));
  expect(host.querySelector('#ai-privacy')?.textContent).toContain('both services');
  await input('ai-description', 'My coat button is loose and I have no sewing supplies.'); await click('Generate AI plan');
  expect(host.textContent).toContain('Generated via AICredits');
  await click('Save this action');
  expect(readAction().action?.customPlan?.provider).toBe('aicredits');
  expect(host.querySelector('#saved-action')?.textContent).toContain('AICredits');
});

it('starts with free questions and preserves a broad answer across saving and reload', async () => {
  expect(host.querySelector('select')).toBeNull();
  expect(host.querySelector('button[aria-pressed="true"]')?.textContent).toBe('Ask freely');
  const request = vi.fn().mockResolvedValue(Response.json({ ...generated, plan: { ...generated.plan,
    summary: 'A small household can prevent food waste by checking what it already has.', action: 'Plan around what needs using first',
    reason: 'Preventing surplus comes before disposal.', steps: ['Check your pantry before making a shopping list.'], resourceIds: ['food'] } }));
  vi.stubGlobal('fetch', request);
  await input('ai-description', 'How can I waste less food in a small household?');
  await click('Generate AI plan'); await click('Save this action');
  expect(readAction().action?.item).toBe('anything');
  expect(readAction().action?.customPlan?.text).toContain('Plan around what needs using first');
  await act(async () => root.unmount()); root = createRoot(host);
  await act(async () => root.render(<DecisionHelper onExploreObject={() => {}} />));
  expect(host.querySelector('#saved-action')?.textContent).toContain('Plan around what needs using first');
  expect(request).toHaveBeenCalledTimes(1);
});
it('never substitutes headphone advice for an open question when AI fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'Unavailable' }, { status: 503 })));
  await input('ai-description', 'What can I do with a broken wooden chair?'); await click('Generate AI plan');
  expect(host.textContent).toContain('This is general guidance, not an answer to your question.');
  expect(host.textContent).not.toContain('Check what you need your headphones to do');
});
