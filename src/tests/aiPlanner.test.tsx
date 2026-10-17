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
  await click('Get AI guidance');
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
  await input('ai-description', 'A coat button is loose and I do not know where to start.'); await click('Get AI guidance');
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('not configured');
  expect(host.textContent).toContain('BASIC GUIDANCE · NOT AI GENERATED');
  expect(host.textContent).not.toContain('AI-GENERATED DRAFT');
});
it('asks for clarification and does not allow saving an unready AI draft', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ...generated, plan: { ...generated.plan, status: 'clarify', steps: [], questions: ['Is the fabric torn or just the stitching?'] } })));
  await input('ai-description', 'There is something wrong with my favourite coat near the shoulder.'); await click('Get AI guidance');
  expect(host.textContent).toContain('Is the fabric torn');
  expect([...host.querySelectorAll('button')].some(b => b.textContent?.includes('Save this action'))).toBe(false);
});
it('discards stale AI output after a form selection changes', async () => {
  await click('Use guided examples');
  let complete!: (value: Response) => void;
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise<Response>(resolve => { complete = resolve; })));
  await input('ai-description', 'A coat button is loose and I have no sewing supplies.'); await click('Get AI guidance');
  const select = host.querySelector('select')!;
  await act(async () => { select.value = 'headphones'; select.dispatchEvent(new Event('change', { bubbles: true })); });
  await act(async () => complete(Response.json(generated)));
  expect(host.textContent).not.toContain('AI-GENERATED DRAFT');
});
it('keeps basic guidance usable with an unfinished optional AI description', async () => {
  await input('ai-description', 'short'); await click('Browse general guidance');
  expect(host.textContent).toContain('BASIC GUIDANCE · NOT AI GENERATED');
  expect(host.querySelector('#ai-description')?.hasAttribute('minlength')).toBe(false);
});

it('keeps provider metadata compatible without displaying provider or model names', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ...generated, model: 'openai/gpt-4o-mini', provider: 'aicredits' })));
  expect(host.querySelector('#ai-privacy')?.textContent).toContain('external AI service');
  await input('ai-description', 'My coat button is loose and I have no sewing supplies.'); await click('Get AI guidance');
  expect(host.textContent).toContain('AI-assisted guidance');
  expect(host.textContent).not.toMatch(/Gemini|AICredits|gpt-4o-mini/);
  await click('Save this action');
  expect(readAction().action?.customPlan?.provider).toBe('aicredits');
  expect(host.querySelector('#saved-action')?.textContent).not.toMatch(/Gemini|AICredits|gpt-4o-mini/);
});

it('starts with free questions and preserves a broad answer across saving and reload', async () => {
  expect(host.querySelector('select')).toBeNull();
  expect(host.querySelector('button[aria-pressed="true"]')?.textContent).toBe('Ask freely');
  const request = vi.fn().mockResolvedValue(Response.json({ ...generated, plan: { ...generated.plan,
    summary: 'A small household can prevent food waste by checking what it already has.', action: 'Plan around what needs using first',
    reason: 'Preventing surplus comes before disposal.', steps: ['Check your pantry before making a shopping list.'], resourceIds: ['food'] } }));
  vi.stubGlobal('fetch', request);
  await input('ai-description', 'How can I waste less food in a small household?');
  await click('Get AI guidance'); await click('Save this action');
  expect(readAction().action?.item).toBe('anything');
  expect(readAction().action?.customPlan?.text).toContain('Plan around what needs using first');
  await act(async () => root.unmount()); root = createRoot(host);
  await act(async () => root.render(<DecisionHelper onExploreObject={() => {}} />));
  expect(host.querySelector('#saved-action')?.textContent).toContain('Plan around what needs using first');
  expect(request).toHaveBeenCalledTimes(1);
});
it('never substitutes headphone advice for an open question when AI fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'Unavailable' }, { status: 503 })));
  await input('ai-description', 'What can I do with a broken wooden chair?'); await click('Get AI guidance');
  expect(host.textContent).toContain('This is general guidance, not an answer to your question.');
  expect(host.textContent).not.toContain('Check what you need your headphones to do');
});

it('offers optional starter questions without sending them automatically', async () => {
  const request = vi.fn(); vi.stubGlobal('fetch', request);
  await click('How can I waste less food?');
  expect(host.querySelector<HTMLTextAreaElement>('#ai-description')?.value).toBe('How can I waste less food?');
  expect(document.activeElement?.id).toBe('ai-description');
  expect(host.querySelector('[aria-label="Example questions"]')).toBeNull();
  expect(request).not.toHaveBeenCalled();
});
it('identifies short input inline and focuses the question without invoking AI', async () => {
  const request = vi.fn(); vi.stubGlobal('fetch', request);
  await input('ai-description', 'short'); await click('Get AI guidance');
  const field = host.querySelector('#ai-description')!;
  expect(field.getAttribute('aria-invalid')).toBe('true');
  expect(field.getAttribute('aria-describedby')).toContain('ai-error');
  expect(document.activeElement).toBe(field);
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('at least 10');
  expect(request).not.toHaveBeenCalled();
});
it('submits AI through the question form and cancels without losing input or accepting late results', async () => {
  let complete!: (value: Response) => void;
  const request = vi.fn().mockReturnValue(new Promise<Response>(resolve => { complete = resolve; })); vi.stubGlobal('fetch', request);
  await input('ai-description', 'Can I reuse glass food jars?');
  await act(async () => host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(host.textContent).toContain('Preparing answer');
  expect(host.textContent).not.toContain('BASIC GUIDANCE · NOT AI GENERATED');
  await click('Cancel request');
  expect(request.mock.calls[0][1].signal.aborted).toBe(true);
  expect(host.querySelector<HTMLTextAreaElement>('#ai-description')?.value).toBe('Can I reuse glass food jars?');
  expect(document.activeElement?.id).toBe('ai-description');
  expect(host.textContent).toContain('Request cancelled. Your question is kept.');
  await act(async () => complete(Response.json(generated)));
  expect(host.textContent).not.toContain('AI-GENERATED DRAFT');
});
it('preserves reviewed draft edits when the question changes and a retry fails', async () => {
  const request = vi.fn().mockResolvedValueOnce(Response.json(generated)).mockRejectedValueOnce(new Error('Network unavailable'));
  vi.stubGlobal('fetch', request);
  await input('ai-description', 'My coat button is loose. What should I do?'); await click('Get AI guidance');
  await input('reviewed-plan', 'Keep my carefully edited plan.');
  await input('ai-description', 'Can I find a matching spare without buying?');
  expect(host.querySelector<HTMLTextAreaElement>('#reviewed-plan')?.value).toBe('Keep my carefully edited plan.');
  expect(host.textContent).toContain('My coat button is loose. What should I do?');
  await click('Get AI guidance');
  expect(host.querySelector<HTMLTextAreaElement>('#reviewed-plan')?.value).toBe('Keep my carefully edited plan.');
  expect(host.textContent).toContain('Your previous draft is still available.');
  await click('Save this action');
  expect(readAction().action?.customPlan?.text).toBe('Keep my carefully edited plan.');
});
it('takes clarification directly back to the original question', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ...generated, plan: { ...generated.plan, status: 'clarify', steps: [], questions: ['What fabric is it?'] } })));
  await input('ai-description', 'There is a tear near the shoulder of my coat.'); await click('Get AI guidance');
  await click('Add details to my question');
  expect(document.activeElement?.id).toBe('ai-description');
  expect(host.querySelector<HTMLTextAreaElement>('#ai-description')?.value).toContain('tear near the shoulder');
});


it('sends optional location and shows it with the answered question without provider branding', async () => {
  const request = vi.fn().mockResolvedValue(Response.json(generated)); vi.stubGlobal('fetch', request);
  await input('ai-description', 'How can I reduce food waste in my small flat?');
  const location = host.querySelector<HTMLInputElement>('#ai-location')!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(location, 'Pune, India');
    location.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await click('Get AI guidance');
  expect(JSON.parse(request.mock.calls[0][1].body).location).toBe('Pune, India');
  expect(host.textContent).toContain('Location: Pune, India');
  expect(host.textContent).not.toMatch(/Gemini|AICredits|gemini-3/);
  expect(host.querySelector('#ai-location-hint')?.textContent).toContain('never detected automatically');
  expect([...host.querySelectorAll('h4')].map(h => h.textContent)).toContain('Suggested steps');
});


it('keeps starter suggestions after the question field and offers optional editing without duplicating the answer', async () => {
  const field = host.querySelector('#ai-description')!;
  const examples = host.querySelector('[aria-label="Example questions"]')!;
  expect(field.compareDocumentPosition(examples) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(generated)));
  await input('ai-description', 'My coat button is loose. What should I do?'); await click('Get AI guidance');
  const review = host.querySelector<HTMLDetailsElement>('#reviewed-plan')!.closest('details')!;
  expect(review.open).toBe(false);
  const summary = review.querySelector('summary')!;
  await act(async () => summary.click());
  expect(review.open).toBe(true);
  await input('reviewed-plan', '');
  expect(host.textContent).toContain('Add some text to the draft before saving it.');
  expect([...host.querySelectorAll('button')].find(b => b.textContent?.includes('Save this action'))?.disabled).toBe(true);
});
