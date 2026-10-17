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
  for (let parent = el.parentElement; parent; parent = parent.parentElement) if (parent instanceof HTMLDetailsElement) parent.open = true;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function click(text: string) {
  const button = [...document.querySelectorAll('button')].find(b => b.textContent?.includes(text));
  if (!button) throw new Error(`Missing ${text}`);
  for (let parent = button.parentElement; parent; parent = parent.parentElement) if (parent instanceof HTMLDetailsElement) parent.open = true;
  await act(async () => button.click());
}
it('generates, edits and saves the actual accepted plan across reload without another model call', async () => {
  const request = vi.fn().mockResolvedValue(Response.json(generated)); vi.stubGlobal('fetch', request);
  await input('ai-description', 'My coat button is loose. I want to use supplies I already have.');
  await click('Get AI guidance');
  expect(host.textContent).toContain('AI-GENERATED DRAFT');
  await input('reviewed-plan', 'My edited plan: ask a friend for a matching spare button.');
  await click('Save action on this device');
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
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ...generated, plan: { ...generated.plan, status: 'clarify', alternative: '', steps: [], questions: ['Is the fabric torn or just the stitching?'] } })));
  await input('ai-description', 'There is something wrong with my favourite coat near the shoulder.'); await click('Get AI guidance');
  expect(host.textContent).toContain('Is the fabric torn');
  expect([...host.querySelectorAll('button')].some(b => b.textContent?.includes('Save action on this device'))).toBe(false);
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
  expect(host.textContent).toContain('AI-GENERATED DRAFT');
  expect(host.textContent).not.toMatch(/Gemini|AICredits|gpt-4o-mini/);
  await click('Save action on this device');
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
  await click('Get AI guidance'); await click('Save action on this device');
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
  await click('Get AI guidance'); await click('Continue without saving');
  expect(host.querySelector<HTMLTextAreaElement>('#reviewed-plan')?.value).toBe('Keep my carefully edited plan.');
  expect(host.textContent).toContain('Your previous draft is still available.');
  await click('Save action on this device');
  expect(readAction().action?.customPlan?.text).toBe('Keep my carefully edited plan.');
});
it('takes clarification directly back to the original question', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ...generated, plan: { ...generated.plan, status: 'clarify', alternative: '', steps: [], questions: ['What fabric is it?'] } })));
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
  const editor = host.querySelector('#reviewed-plan')!.closest('details')!;
  expect(editor.open).toBe(false);
  expect(editor.querySelector('summary')?.textContent).toBe('Edit before saving');
  await act(async () => editor.querySelector('summary')!.click());
  expect(editor.open).toBe(true);
  await input('reviewed-plan', '');
  expect(host.textContent).toContain('Add some text to the draft before saving it.');
  expect([...host.querySelectorAll('button')].find(b => b.textContent?.includes('Save action on this device'))?.disabled).toBe(true);
});
it('supports follow-ups, saves original context and clears only unsaved conversation', async () => {
  await act(async () => root.render(<DecisionHelper standalone onExploreObject={() => {}} />));
  const request = vi.fn().mockImplementation(async () => Response.json(generated)); vi.stubGlobal('fetch', request);
  const original = 'I live in Pune and want to mend my coat without spending.';
  await input('ai-description', original); await click('Get AI guidance');
  expect(host.querySelector<HTMLTextAreaElement>('#ai-description')?.value).toBe('');
  const result = host.querySelector('[aria-label="Your answer"]')!;
  const composer = host.querySelector('form')!;
  expect(result.compareDocumentPosition(composer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  await click('Save action on this device');
  expect(readAction().action?.question).toBe(original);
  await input('action-note', 'Private note that should stay local');
  await input('ai-description', 'What if I cannot find the spare button?'); await click('Get AI guidance');
  const body = JSON.parse(request.mock.calls[1][1].body);
  expect(body.context[0].question).toBe(original);
  expect(JSON.stringify(body)).not.toContain('Private note');
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
  await click('Start a new conversation'); expect(host.textContent).toContain('AI-GENERATED DRAFT');
  confirm.mockReturnValue(true); await click('Start a new conversation');
  expect(host.textContent).not.toContain('AI-GENERATED DRAFT');
  expect(host.querySelector<HTMLTextAreaElement>('#ai-description')?.value).toBe('');
  expect(readAction().action?.note).toContain('Private note');
  await input('ai-description', 'How can I reduce packaging waste at home?'); await click('Get AI guidance');
  expect(JSON.parse(request.mock.calls[2][1].body).context).toBeUndefined();
});
it('shows food safety guidance for food-related answers', async () => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => Response.json(generated)));
  await input('ai-description', 'How can I prevent vegetable food waste in my flat?'); await click('Get AI guidance');
  expect(host.querySelector('[aria-label="Food safety"]')?.textContent).toContain('cannot determine whether food is safe');
});
it('keeps editable original details after recent turns expire and clears them on reset', async () => {
  await act(async () => root.render(<DecisionHelper standalone onExploreObject={() => {}} />));
  const request = vi.fn().mockImplementation(async () => Response.json(generated)); vi.stubGlobal('fetch', request);
  const original = 'I live in Pune with no garden and cannot spend any money.';
  await input('ai-description', original); await click('Get AI guidance');
  for (const question of ['What else should I consider here?', 'Can you explain the reason a little more?', 'How should I choose between those options?']) {
    await input('ai-description', question); await click('Get AI guidance');
  }
  const latest = JSON.parse(request.mock.calls[3][1].body);
  expect(latest.context).toHaveLength(2);
  expect(latest.context.some((turn: { question: string }) => turn.question === original)).toBe(false);
  expect(latest.background).toBe(original);
  await input('conversation-background', 'I now live in Mumbai and have access to a shared garden.');
  await input('ai-description', 'Please adapt the next step to my updated situation.'); await click('Get AI guidance');
  expect(JSON.parse(request.mock.calls[4][1].body).background).toContain('Mumbai');
  await input('conversation-background', '');
  await input('ai-description', 'Please give me general guidance without that background.'); await click('Get AI guidance');
  expect(JSON.parse(request.mock.calls[5][1].body).background).toBeUndefined();
  vi.spyOn(window,'confirm').mockReturnValue(true); await click('Start a new conversation');
  await input('ai-description', 'How can I use less packaging at home?'); await click('Get AI guidance');
  expect(JSON.parse(request.mock.calls[6][1].body).background).toBeUndefined();
});
it('renders explanation and refusal responses without a save button or empty action sections', async () => {
  for (const status of ['explanation','refused'] as const) {
    vi.stubGlobal('fetch',vi.fn().mockImplementation(async () => Response.json({...generated,plan:{...generated.plan,status,steps:[],alternative:''}})));
    await input('ai-description', 'Explain which options fit the lower-waste theme.'); await click('Get AI guidance');
    expect(host.textContent).not.toContain('Another option:');
    expect(host.querySelector('#reviewed-plan')).toBeNull();
    expect([...host.querySelectorAll('button')].some(b=>b.textContent?.includes('Save action on this device'))).toBe(false);
  }
});
it('prioritizes the first answer and keeps the submitted question in a closed disclosure', async () => {
  await act(async () => root.render(<DecisionHelper standalone onExploreObject={() => {}} />));
  vi.stubGlobal('fetch',vi.fn().mockImplementation(async()=>Response.json(generated)));
  const question='My coat has a loose button and I cannot spend money on repairs.';
  await input('ai-description',question); await click('Get AI guidance');
  expect(host.textContent).not.toContain('You asked');
  const summary=[...host.querySelectorAll('summary')].find(s=>s.textContent==='View your question')!;
  const details=summary.closest('details')!;
  expect(details.open).toBe(false); expect(details.textContent).toContain(question);
  expect(host.querySelector('[aria-label="Your answer"]')?.querySelector('h2')?.textContent).toBe(generated.plan.action);
  await act(async()=>summary.click()); expect(details.open).toBe(true);
  await input('ai-description','What if I cannot find a replacement button?'); await click('Get AI guidance');
  expect(host.textContent).not.toContain('You asked');
  expect(host.textContent).toContain('Recent exchanges');
  expect([...host.querySelectorAll('summary')].some(s=>s.textContent==='View your question')).toBe(true);
});
it('shows one actionable error on standalone without adding a duplicate unavailable answer', async () => {
  await act(async () => root.render(<DecisionHelper standalone onExploreObject={() => {}} />));
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({error:'Service temporarily unavailable.'},{status:503})));
  const question='How can I reduce packaging waste at home?';
  await input('ai-description',question); await click('Get AI guidance');
  expect(host.querySelectorAll('[role="alert"]')).toHaveLength(1);
  expect(host.querySelector('[aria-label="Your answer"]')).toBeNull();
  expect(host.querySelector<HTMLTextAreaElement>('#ai-description')?.value).toBe(question);
  expect(host.textContent).not.toContain('AI guidance isn’t available right now');
});
it('does not show replacement warnings for a clarification that cannot be saved', async () => {
  localStorage.setItem('beforewaste_action_v1',JSON.stringify({item:'clothes',intent:'buy',support:'myself',budget:'free',note:'Keep this note',outcome:'planned'}));
  await act(async()=>root.render(<DecisionHelper key="saved-clarify" standalone onExploreObject={()=>{}} />));
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({...generated,plan:{...generated.plan,status:'clarify',steps:[],alternative:'',questions:['What fabric is it?']}})));
  await input('ai-description','How can I repair this unidentified fabric?'); await click('Get AI guidance');
  expect(host.textContent).toContain('What fabric is it?');
  expect(host.textContent).not.toContain('Replacing your action starts a new note');
  expect(readAction().action?.note).toBe('Keep this note');
});
it('updates the current saved plan without resetting its note and progress', async () => {
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json(generated)));
  await input('ai-description','My coat has a loose button and I need a practical repair.'); await click('Get AI guidance'); await click('Save action on this device');
  await input('action-note','Keep my note');
  const outcome=host.querySelector<HTMLSelectElement>('#action-outcome')!;
  await act(async()=>{outcome.value='done';outcome.dispatchEvent(new Event('change',{bubbles:true}));});
  await input('reviewed-plan','My updated action\n\nAsk a friend for a matching button.');
  await click('Update my saved action');
  expect(readAction().action).toMatchObject({note:'Keep my note',outcome:'done'});
  expect(host.querySelector('#saved-action-title')?.textContent).toBe('My updated action');
  expect(readAction().action?.customPlan?.text).toContain('Ask a friend');
  await click('Undo last change');
  expect(readAction().action?.customPlan?.text).not.toContain('My updated action');
  expect(readAction().action?.note).toBe('Keep my note');
});
it('offers a retry when browser saving fails, without dropping session edits or notes', async () => {
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json(generated)));
  await input('ai-description','My coat has a loose button and I need a repair plan.'); await click('Get AI guidance');
  const write=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked');});
  await click('Save action on this device'); await input('action-note','Keep this session note');
  expect(host.querySelector('#action-storage-status')?.textContent).toContain('session only');
  write.mockRestore(); await click('Try saving again');
  expect(readAction().action?.note).toBe('Keep this session note');
  expect(host.querySelector('#action-storage-status')?.textContent).toContain('Action saved');
});

it('keeps editing direct and copying only in the saved section', async () => {
  await act(async () => root.render(<DecisionHelper standalone onExploreObject={() => {}} />));
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(generated)));
  await input('ai-description', 'My coat has a loose button. What should I check?'); await click('Get AI guidance');
  expect([...host.querySelectorAll('button')].some(button => button.textContent === 'Copy answer')).toBe(false);
  expect([...host.querySelectorAll('summary')].some(summary => summary.textContent === 'More')).toBe(false);
  expect(host.querySelector('#reviewed-plan')?.closest('details')?.open).toBe(false);
  expect(host.textContent).not.toContain('Ask a follow-up below');
  expect(host.textContent).not.toContain('Answer these questions below');
  expect(host.querySelector('#conversation-background')?.closest('details')?.querySelector('summary')?.textContent).toBe('Conversation settings');
  await click('Save action on this device');
  expect([...host.querySelectorAll('button')].some(button => button.textContent === 'Save action on this device')).toBe(false);
  expect([...host.querySelectorAll('a')].find(link => link.textContent === 'Saved · View my action')?.getAttribute('href')).toBe('#saved-action');
  expect(host.querySelector('[aria-label="Assistant sections"] a[href="#saved-action"]')?.textContent).toContain('1');
  const copyButtons = [...host.querySelectorAll('button')].filter(button => button.textContent?.startsWith('Copy'));
  expect(copyButtons).toHaveLength(1);
  expect(copyButtons[0].closest('#saved-action')).not.toBeNull();
});
it('provides a permanent saved-action section with an honest empty state', async () => {
  expect(host.querySelector('#saved-section-title')?.textContent).toBe('My saved action');
  expect(host.querySelector('#saved-action')?.textContent).toContain('No saved action yet');
  expect(host.querySelector('#saved-action')?.textContent).toContain('does not sync across devices');
  expect(host.querySelector('[aria-label="Assistant sections"] a[href="#saved-action"]')?.textContent).toContain('0');
});
it('offers a reply input for clarification without save or edit actions', async () => {
  await act(async () => root.render(<DecisionHelper standalone onExploreObject={() => {}} />));
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({...generated,plan:{...generated.plan,status:'clarify',steps:[],alternative:'',questions:['Which item needs attention?']}})));
  await input('ai-description', 'Should I repair or replace it?'); await click('Get AI guidance');
  expect(host.querySelector('label[for="ai-description"]')?.textContent).toBe('Answer the questions above');
  expect(host.querySelector('#reviewed-plan')).toBeNull();
  expect([...host.querySelectorAll('button')].some(button => /Save action on this device|Edit before saving/.test(button.textContent ?? ''))).toBe(false);
});

it('keeps settings after the reply form and uses a proper answer heading', async () => {
  await act(async () => root.render(<DecisionHelper standalone onExploreObject={() => {}} />));
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(generated)));
  await input('ai-description', 'A button fell off my jacket. What should I check?'); await click('Get AI guidance');
  expect(host.querySelector('[aria-label="Your answer"] h2')?.textContent).toBe(generated.plan.action);
  const composer = host.querySelector('form')!;
  const settings = host.querySelector('#conversation-background')!.closest('details')!;
  expect(composer.compareDocumentPosition(settings) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(settings.open).toBe(false);
});

it('does not send a follow-up or discard edited text when replacement is cancelled', async () => {
  await act(async () => root.render(<DecisionHelper standalone onExploreObject={() => {}} />));
  const request = vi.fn().mockResolvedValue(Response.json(generated)); vi.stubGlobal('fetch', request);
  await input('ai-description', 'A button fell off my jacket. What should I check?'); await click('Get AI guidance');
  await input('reviewed-plan', 'Keep this manually edited action.');
  await input('ai-description', 'What could I do without sewing supplies?');
  await click('Get AI guidance');
  expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Replace your edited draft?');
  await click('Keep my draft');
  expect(request).toHaveBeenCalledTimes(1);
  expect(host.querySelector<HTMLTextAreaElement>('#reviewed-plan')?.value).toBe('Keep this manually edited action.');
  expect(host.querySelector<HTMLTextAreaElement>('#ai-description')?.value).toContain('without sewing supplies');
  await click('Get AI guidance'); await click('Continue without saving');
  expect(request).toHaveBeenCalledTimes(2);
});
it('does not interrupt an ordinary follow-up with an edit warning', async () => {
  await act(async () => root.render(<DecisionHelper standalone onExploreObject={() => {}} />));
  const request = vi.fn().mockResolvedValue(Response.json(generated)); vi.stubGlobal('fetch', request);
  await input('ai-description', 'A button fell off my jacket. What should I check?'); await click('Get AI guidance');
  await input('ai-description', 'What could I do without sewing supplies?'); await click('Get AI guidance');
  expect(document.querySelector('[role="dialog"]')).toBeNull(); expect(request).toHaveBeenCalledTimes(2);
});
it('reports unreadable storage honestly and retries loading without replacing saved data', async () => {
  localStorage.setItem('beforewaste_action_v1', JSON.stringify({item:'clothes',intent:'buy',support:'myself',budget:'free',note:'Keep my original note',outcome:'planned'}));
  const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  await act(async () => root.render(<DecisionHelper key="unreadable" standalone onExploreObject={() => {}} />));
  expect(host.querySelector('#saved-action')?.textContent).toContain('Saved action unavailable');
  expect(host.querySelector('#saved-action')?.textContent).not.toContain('No saved action yet');
  expect(host.querySelector('[aria-label="Assistant sections"]')?.textContent).toContain('Unavailable');
  read.mockRestore(); await click('Try loading again');
  expect(host.querySelector<HTMLTextAreaElement>('#action-note')?.value).toBe('Keep my original note');
  expect(readAction().action?.note).toBe('Keep my original note');
});
it('keeps the save retry inside the affected saved-action section', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(generated)));
  await input('ai-description', 'My coat needs a button. What should I check?'); await click('Get AI guidance');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  await click('Save action on this device');
  const retry = [...host.querySelectorAll('button')].find(button => button.textContent === 'Try saving again')!;
  expect(retry.closest('#saved-action')).not.toBeNull();
  expect([...host.querySelectorAll('a')].some(link => link.textContent === 'Session only · View my action')).toBe(true);
});
