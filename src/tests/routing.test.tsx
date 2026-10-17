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
  expect(host.querySelector<HTMLTextAreaElement>('#ai-description')?.value).toContain('small flat');
  expect(host.querySelector('#saved-action')?.textContent).toContain('Keep my existing action');
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
