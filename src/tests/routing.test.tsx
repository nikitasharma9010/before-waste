import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import App from '../App';
import { handoffQuestion, takeQuestionDraft, QUESTION_DRAFT_KEY } from '../utils/questionDraft';
import { ACTION_KEY } from '../utils/actionStorage';

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  window.history.replaceState({}, '', '/'); sessionStorage.clear(); localStorage.clear();
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals(); window.history.replaceState({}, '', '/'); });
it('shows only a compact entry on home and full guidance at a directly loaded ask route', async () => {
  await act(async () => root.render(<App />));
  expect(host.querySelector('#assistant-entry')).not.toBeNull();
  expect(host.querySelector('#ai-description')).toBeNull();
  await act(async () => root.unmount()); root = createRoot(host);
  window.history.replaceState({}, '', '/ask');
  const request = vi.fn(); vi.stubGlobal('fetch', request);
  handoffQuestion('How can I reduce food waste in a small flat?');
  localStorage.setItem(ACTION_KEY, JSON.stringify({ item: 'clothes', intent: 'buy', support: 'myself', budget: 'free', note: 'Keep my existing action', outcome: 'planned' }));
  await act(async () => root.render(<App />));
  expect(host.querySelector('h1')?.textContent).toBe('Ask Before Waste');
  expect(host.querySelectorAll('h1')).toHaveLength(1);
  expect(host.querySelector('#assistant-entry')).toBeNull();
  expect(host.querySelector('#object-preview')).toBeNull();
  expect(host.querySelector('header a[href="/#follow-one-thing"]')?.textContent).toContain('Follow One Thing');
  expect(host.querySelectorAll('header a[href="/#follow-one-thing"]')).toHaveLength(1);
  expect(host.querySelector<HTMLTextAreaElement>('#ai-description')?.value).toContain('small flat');
  expect(host.querySelector('#saved')?.textContent).toContain('Keep my existing action');
  expect(sessionStorage.getItem(QUESTION_DRAFT_KEY)).toBeNull();
  expect(request).not.toHaveBeenCalled();
  expect(document.title).toContain('Ask Before Waste');
  expect(host.querySelector('a[aria-current="page"]')?.getAttribute('href')).toBe('/ask');
  expect(host.querySelector('header a[href="/#pause"]')).not.toBeNull();
});
it('expires and discards malformed handoff drafts and handles blocked storage', () => {
  expect(handoffQuestion('A valid theme-related question')).toBe(true);
  expect(takeQuestionDraft()).toBe('A valid theme-related question');
  expect(takeQuestionDraft()).toBe('');
  for (const raw of ['bad json', JSON.stringify({ question: 'old', created: Date.now()-16*60*1000 }), JSON.stringify({ question: 'x'.repeat(1501), created: Date.now() })]) {
    sessionStorage.setItem(QUESTION_DRAFT_KEY, raw); expect(takeQuestionDraft()).toBe('');
  }
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  expect(handoffQuestion('Question')).toBe(false);
});
it('never puts the homepage question into a URL or sends it to AI on continue', async () => {
  const request = vi.fn(); vi.stubGlobal('fetch', request);
  await act(async () => root.render(<App />));
  const field = host.querySelector<HTMLTextAreaElement>('#entry-question')!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')!.set!.call(field, 'How can I reuse glass jars?');
    field.dispatchEvent(new Event('input',{bubbles:true}));
  });
  const form=field.closest('form')!;
  await act(async () => form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  expect(form.getAttribute('action')).toBe('/ask');
  expect(field.hasAttribute('name')).toBe(false);
  expect(takeQuestionDraft()).toBe('How can I reuse glass jars?');
  expect(request).not.toHaveBeenCalled();
});
it('renders the branded not-found page for an unknown route instead of a blank or crashed app', async () => {
  window.history.replaceState({}, '', '/this-page-does-not-exist');
  await act(async () => root.render(<App />));
  expect(host.querySelector('h1')?.textContent).toContain("doesn't exist");
  expect(host.querySelector('a[href="/"]')?.textContent).toContain('Back to the homepage');
  expect(document.title).toContain('Page Not Found');
  expect(host.querySelector('header')).not.toBeNull();
});
it('preserves the draft and offers manual recovery when tab storage is unavailable', async () => {
  await act(async () => root.render(<App />));
  vi.spyOn(Storage.prototype,'setItem').mockImplementation(() => { throw new Error('blocked'); });
  const form=host.querySelector('#assistant-entry form')!;
  const submit = new Event('submit',{bubbles:true,cancelable:true});
  await act(async () => form.dispatchEvent(submit));
  expect(submit.defaultPrevented).toBe(true);
  expect(host.querySelector('[role="alert"]')?.textContent).toContain('Copy your question');
  expect(host.querySelector('a[href="/ask"]')).not.toBeNull();
});
it('connects the final story stage to an editable question without calling AI', async () => {
  Element.prototype.scrollIntoView = vi.fn();
  const request = vi.fn(); vi.stubGlobal('fetch', request);
  await act(async () => root.render(<App />));
  const stages = [...host.querySelectorAll<HTMLButtonElement>('button')].filter(b => b.getAttribute('aria-label')?.startsWith('Next:'));
  expect(stages.length).toBeGreaterThan(0);
  for (let i = 0; i < 4; i++) {
    const next = host.querySelector<HTMLButtonElement>('button[aria-label^="Next:"]')!;
    await act(async () => next.click());
  }
  const link = [...host.querySelectorAll<HTMLAnchorElement>('a')].find(a => a.textContent === 'Plan my next step')!;
  expect(link.getAttribute('href')).toBe('/ask');
  await act(async () => link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })));
  expect(takeQuestionDraft()).toContain('T-shirt');
  expect(request).not.toHaveBeenCalled();
});
it('opens learning deep links and makes reflection directly accessible', async () => {
  window.history.replaceState({}, '', '/#one-planet');
  await act(async () => root.render(<App />));
  expect(host.querySelector<HTMLElement>('#one-planet')?.closest<HTMLElement>('[data-learning-panel]')?.hidden).toBe(false);
  expect(host.querySelector<HTMLElement>('#systems')?.closest<HTMLElement>('[data-learning-panel]')?.hidden).toBe(true);
  expect(document.activeElement?.id).toBe('one-planet');
  await act(async () => {
    window.history.replaceState({}, '', '/#systems'); window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(host.querySelector<HTMLElement>('#systems')?.closest<HTMLElement>('[data-learning-panel]')?.hidden).toBe(false);
  expect(document.activeElement?.id).toBe('systems');
  expect(host.querySelector('#pause')?.closest('details')).toBeNull();
  expect(host.querySelector<HTMLElement>('#one-planet')?.closest<HTMLElement>('[data-learning-panel]')?.hidden).toBe(true);
});
it('resumes a selected story and stage after visiting the assistant', async () => {
  await act(async () => root.render(<App />));
  await act(async () => host.querySelector<HTMLButtonElement>('#object-tab-smartphone')!.click());
  await act(async () => host.querySelector<HTMLButtonElement>('button[aria-label^="Stage 3:"]')!.click());
  await act(async () => root.unmount()); root = createRoot(host);
  window.history.replaceState({}, '', '/ask');
  await act(async () => root.render(<App />));
  expect(host.querySelector('header a[href="/#follow-one-thing"]')).not.toBeNull();
  await act(async () => root.unmount()); root = createRoot(host);
  window.history.replaceState({}, '', '/#follow-one-thing');
  await act(async () => root.render(<App />));
  expect(host.querySelector('#object-tab-smartphone')?.getAttribute('aria-pressed')).toBe('true');
  expect(host.querySelector('[aria-current="step"]')?.getAttribute('aria-label')).toContain('Stage 3:');
  await act(async () => [...host.querySelectorAll<HTMLAnchorElement>('a')].find(a=>a.textContent==='Explore an object’s story')!.click());
  expect(host.querySelector('[aria-current="step"]')?.getAttribute('aria-label')).toContain('Stage 3:');
});
it('places a saved-action return path in the welcome and focuses saved actions on direct entry', async () => {
  localStorage.setItem(ACTION_KEY,JSON.stringify({item:'clothes',intent:'buy',support:'myself',budget:'free',note:'Keep this note',outcome:'planned'}));
  await act(async () => root.render(<App />));
  expect(host.querySelector('#hero a[href="/ask#saved"]')).not.toBeNull();
  await act(async () => root.unmount()); root=createRoot(host);
  window.history.replaceState({}, '', '/ask#saved-action');
  await act(async () => root.render(<App />));
  expect(document.activeElement?.id).toBe('saved-action');
});
it('carries the chosen scenario into an editable question without sending it to AI', async () => {
  const request=vi.fn(); vi.stubGlobal('fetch',request);
  await act(async () => root.render(<App />));
  const link=[...host.querySelectorAll<HTMLAnchorElement>('a')].find(a=>a.textContent==='Ask about this choice')!;
  link.addEventListener('click',event=>event.preventDefault());
  await act(async () => link.click());
  const question=takeQuestionDraft();
  expect(question).toContain('headphones'); expect(question).toContain('repaired');
  expect(request).not.toHaveBeenCalled();
});
it('limits the materials detail to its hotspots and the selected T-shirt', async () => {
  await act(async()=>root.render(<App />));
  const panel=host.querySelector('#object-preview')!;
  expect(panel.querySelectorAll('button[aria-label^="Inspect "]')).toHaveLength(4);
  expect(panel.textContent).not.toContain('Chapters of an everyday T-shirt');
  expect(panel.textContent).not.toContain('Our Promise');
  expect(panel.querySelectorAll('a')).toHaveLength(0);
  await act(async()=>host.querySelector<HTMLButtonElement>('#object-tab-smartphone')!.click());
  expect(host.querySelector('#object-preview')).toBeNull();
});

it('starts learning open and smoothly follows repeated section links while respecting reduced motion', async () => {
  const scroll = vi.fn(); Element.prototype.scrollIntoView = scroll;
  await act(async () => root.render(<App />));
  expect(host.querySelector<HTMLElement>('#bigger-pattern')?.closest<HTMLElement>('[data-learning-panel]')?.hidden).toBe(false);
  const link = host.querySelector<HTMLAnchorElement>('header a[href="/#learn"]')!;
  await act(async () => link.click());
  expect(location.hash).toBe('#learn');
  expect(document.activeElement?.id).toBe('learn');
  expect(scroll).toHaveBeenLastCalledWith({ block: 'start', behavior: 'smooth' });
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
  await act(async () => link.click());
  expect(scroll).toHaveBeenLastCalledWith({ block: 'start', behavior: 'auto' });
});

it('keeps section navigation in content order and marks the chosen destination', async () => {
  await act(async () => root.render(<App />));
  const nav = host.querySelector('nav[aria-label="Primary navigation"]')!;
  expect([...nav.querySelectorAll('a')].map(a => a.hash)).toEqual(['#follow-one-thing', '#what-would-you-do', '#learn', '#pause']);
  const choice = nav.querySelector<HTMLAnchorElement>('a[href="/#what-would-you-do"]')!;
  await act(async () => choice.click());
  expect(document.activeElement?.id).toBe('what-would-you-do');
  expect(choice.getAttribute('aria-current')).toBe('location');
  await act(async () => {
    history.replaceState(null, '', '/#pause'); window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(nav.querySelector('a[aria-current="location"]')?.getAttribute('href')).toBe('/#pause');
  expect(choice.hasAttribute('aria-current')).toBe(false);
});
it('preserves browser handling for new-tab, download and unknown section links', async () => {
  await act(async () => root.render(<App />));
  for (const attrs of [{ target: '_blank', href: '#learn' }, { download: '', href: '#learn' }, { href: '#not-a-section' }]) {
    const link = document.createElement('a');
    Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value)); host.append(link);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    await act(async () => link.dispatchEvent(event));
    expect(event.defaultPrevented).toBe(false);
    link.remove();
  }
});
it('connects each learning topic to the next and opens the destination', async () => {
  await act(async () => root.render(<App />));
  const link = host.querySelector<HTMLAnchorElement>('#bigger-pattern + nav a[href="#one-planet"]')!;
  await act(async () => link.click());
  expect(document.activeElement?.id).toBe('one-planet');
  expect(host.querySelector<HTMLElement>('#one-planet')?.closest<HTMLElement>('[data-learning-panel]')?.hidden).toBe(false);
  expect(host.querySelector<HTMLElement>('#bigger-pattern')?.closest<HTMLElement>('[data-learning-panel]')?.hidden).toBe(true);
  const next = host.querySelector<HTMLAnchorElement>('a[href="#systems"]')!;
  await act(async () => next.click());
  expect(document.activeElement?.id).toBe('systems');
  expect(host.querySelector('header a[aria-current="location"]')?.textContent).toBe('Understand waste');
  expect(host.querySelector<HTMLElement>('#one-planet')?.closest<HTMLElement>('[data-learning-panel]')?.hidden).toBe(true);
});

it('keeps all learning topics available and preserves exploration when switching', async () => {
  await act(async () => root.render(<App />));
  const topics = host.querySelector('nav[aria-label="Learning topics"]')!;
  expect(topics.querySelectorAll('a')).toHaveLength(3);
  await act(async () => host.querySelector<HTMLButtonElement>('#tab-linear')!.click());
  await act(async () => topics.querySelector<HTMLAnchorElement>('a[href="#systems"]')!.click());
  expect(topics.querySelector('a[aria-current="true"]')?.textContent).toBe('Design and collective change');
  await act(async () => topics.querySelector<HTMLAnchorElement>('a[href="#bigger-pattern"]')!.click());
  expect(host.querySelector('#tab-linear')?.getAttribute('aria-pressed')).toBe('true');
  expect(host.querySelectorAll('[data-learning-panel]:not([hidden])')).toHaveLength(1);
});

it('supports an empty saved-action deep link and a direct return to Ask', async () => {
  history.replaceState({}, '', '/ask#saved-action');
  await act(async () => root.render(<App />));
  expect(document.activeElement?.id).toBe('saved-action');
  expect(host.querySelector('#saved')?.textContent).toContain('No saved answers yet');
  const back = host.querySelector<HTMLAnchorElement>('#saved a[href="#ask"]')!;
  await act(async () => back.click());
  expect(document.activeElement?.id).toBe('ask');
});

it('provides one data disclosure on ask and opens it from the footer', async () => {
  history.replaceState({}, '', '/ask');
  await act(async () => root.render(<App />));
  expect(host.querySelectorAll('#how-it-works')).toHaveLength(1);
  expect([...host.querySelectorAll('summary')].filter(summary => summary.textContent === 'How it works and your data')).toHaveLength(1);
  expect(host.textContent).not.toContain('Back to the stories');
  const link = host.querySelector<HTMLAnchorElement>('footer a[href="#how-it-works"]')!;
  await act(async () => link.click());
  expect(host.querySelector<HTMLDetailsElement>('#how-it-works')?.open).toBe(true);
  expect(document.activeElement?.id).toBe('how-it-works');
  expect(host.querySelector('#how-it-works')?.textContent).toContain('Your saved notes are not sent');
});
