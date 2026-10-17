import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DecisionHelper } from '../components/DecisionHelper';
import { issues, recommend, recoveryAdvice, type Item, type Intent } from '../data/decisionData';
import App from '../App';
import { ACTION_KEY, readAction } from '../utils/actionStorage';

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  localStorage.clear();
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => { fn(0); return 0; });
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
async function render() { await act(async () => root.render(<DecisionHelper onExploreObject={() => {}} />)); }
async function click(text: string) {
  const el = [...host.querySelectorAll('button')].find(b => b.textContent?.includes(text));
  if (!el) throw new Error(`Missing ${text}`);
  await act(async () => el.click());
}
async function select(index: number, value: string) {
  const el = host.querySelectorAll('select')[index];
  await act(async () => { el.value = value; el.dispatchEvent(new Event('change', { bubbles: true })); });
}
it('offers all six situations and adapts repair advice to budget and help', () => {
  for (const item of ['clothes', 'headphones'] as Item[]) for (const intent of ['buy', 'fix', 'pass'] as Intent[]) {
    expect(recommend({ item, intent, support: 'myself', budget: 'free' }).step.length).toBeGreaterThan(40);
  }
  const base = { item: 'clothes', intent: 'fix', support: 'myself', budget: 'free' } as const;
  expect(recommend(base).step).toContain('matching guide');
  expect(recommend({ ...base, support: 'help' }).step).toContain('quote');
  expect(recommend(base).cost).toContain('Confirm any charges');
  expect(recommend({ ...base, budget: 'flexible' }).cost).toContain('replacement');
});
it('saves an action, restores it on return and records an outcome', async () => {
  await render(); await click('Find my next step'); await click('Save this action');
  expect(readAction().action?.intent).toBe('buy');
  await act(async () => root.unmount()); root = createRoot(host); await render();
  expect(host.querySelector('#saved-action-title')?.textContent).toContain('wardrobe');
  const outcome = host.querySelector<HTMLSelectElement>('#action-outcome')!;
  await act(async () => { outcome.value = 'blocked'; outcome.dispatchEvent(new Event('change', { bubbles: true })); });
  expect(readAction().action?.outcome).toBe('blocked');
  await click('Remove saved action'); expect(readAction().action).toBeNull();
});
it('clears stale advice when an answer changes and provides model-specific caution', async () => {
  await render(); await click('Find my next step');
  await select(0, 'headphones');
  expect(host.textContent).not.toContain('Save this action for the week');
  await select(1, 'fix'); await click('Find my next step');
  expect(host.textContent).toContain('battery is swollen');
  expect(host.querySelector('a[href="https://www.ifixit.com/Device/Headphone"]')).not.toBeNull();
});
it('keeps the action usable when storage writes fail and does not pretend removal succeeded', async () => {
  await render(); await click('Find my next step');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  await click('Save this action');
  expect(host.querySelector('#action-storage-status')?.textContent).toContain('session only');
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked'); });
  await click('Remove saved action');
  expect(host.querySelector('#saved-action-title')).not.toBeNull();
  expect(host.querySelector('#action-storage-status')?.textContent).toContain('could not be removed');
});
it('rejects untrusted stored shapes', () => {
  localStorage.setItem(ACTION_KEY, JSON.stringify({ item: 'unknown', intent: 'fix' }));
  expect(readAction().action).toBeNull();
  localStorage.setItem(ACTION_KEY, JSON.stringify({ item: ['clothes'], intent: 'fix', support: 'help', budget: 'free', outcome: 'planned', note: '' }));
  expect(readAction().action).toBeNull();
});

it('keeps notes and outcomes when viewing the same saved recommendation', async () => {
  localStorage.setItem(ACTION_KEY, JSON.stringify({ item: 'clothes', intent: 'buy', support: 'myself', budget: 'free', note: 'Keep my plan', outcome: 'done' }));
  await render(); await click('Find my next step'); await click('View my saved action');
  expect(readAction().action?.note).toBe('Keep my plan');
  expect(readAction().action?.outcome).toBe('done');
});

it('undoes a replacement including the original note, outcome and barrier', async () => {
  localStorage.setItem(ACTION_KEY, JSON.stringify({ item: 'clothes', intent: 'buy', support: 'myself', budget: 'free', note: 'Keep this history', outcome: 'blocked', barrier: 'time' }));
  await render(); await select(0, 'headphones'); await click('Find my next step');
  expect(host.textContent).toContain('starts a new note and outcome');
  await click('Replace my saved action'); expect(readAction().action?.item).toBe('headphones');
  await click('Undo last');
  expect(readAction().action).toMatchObject({ item: 'clothes', note: 'Keep this history', outcome: 'blocked', barrier: 'time' });
});

it('focuses a stable heading after removal and allows undo', async () => {
  await render(); await click('Find my next step'); await click('Save this action');
  await click('Remove saved action');
  expect(document.activeElement).toBe(host.querySelector('#decision-title'));
  expect(host.querySelector('#action-storage-status')?.textContent).toContain('removed');
  await click('Undo last'); expect(readAction().action?.item).toBe('clothes');
});

it('offers and persists barrier-specific alternatives without changing the original action', async () => {
  await render(); await click('Find my next step'); await click('Save this action');
  const outcome = host.querySelector<HTMLSelectElement>('#action-outcome')!;
  await act(async () => { outcome.value = 'blocked'; outcome.dispatchEvent(new Event('change', { bubbles: true })); });
  const barrier = host.querySelector<HTMLSelectElement>('#action-barrier')!;
  await act(async () => { barrier.value = 'time'; barrier.dispatchEvent(new Event('change', { bubbles: true })); });
  expect(host.textContent).toContain('You do not have to finish today');
  expect(readAction().action).toMatchObject({ item: 'clothes', intent: 'buy', barrier: 'time' });
});

it('provides distinct issue advice and resets the issue when changing categories', async () => {
  const base = { item: 'headphones', intent: 'fix', support: 'myself', budget: 'free' } as const;
  const steps = issues.headphones.map(issue => recommend({ ...base, issue: issue.id }).step);
  expect(new Set(steps).size).toBe(issues.headphones.length);
  expect(recommend({ ...base, issue: 'pads' }).step).toContain('replacement pads');
  expect(recommend({ ...base, issue: 'connection' }).step).toContain('pairing');
  expect(recommend({ ...base, issue: 'sound' }).step).toContain('audio output');
  await render(); await select(1, 'fix'); await select(2, 'button');
  await click('Find my next step'); expect(host.textContent).toContain('button-sewing');
  await select(0, 'headphones');
  expect(host.querySelectorAll('select')[2].value).toBe('unsure');
});

it('uses relevant reuse resources and validates older saved records', () => {
  for (const item of ['clothes', 'headphones'] as Item[]) {
    const d = { item, intent: 'pass', budget: 'free', support: 'myself' } as const;
    expect(recommend(d).resource.url).toContain('epa.gov');
    expect(recommend(d).resource.label).toContain('US guidance');
    expect(recoveryAdvice(d, 'access')).toContain('collection route');
  }
  localStorage.setItem(ACTION_KEY, JSON.stringify({ item: 'clothes', intent: 'fix', support: 'myself', budget: 'free', note: 'Old note', outcome: 'planned', issue: 'sound', barrier: 'unknown' }));
  expect(readAction().action).toMatchObject({ note: 'Old note', issue: 'unsure', barrier: undefined });
});

it('puts the decision flow before the interactive preview and aligns header calls to action', async () => {
  await act(async () => root.render(<App />));
  const children = [...host.querySelector('main')!.children];
  expect(children.indexOf(host.querySelector('#decision-helper')!)).toBeLessThan(children.indexOf(host.querySelector('#object-preview')!));
  const cta = [...host.querySelectorAll('header a')].find(a => a.textContent?.includes('Find my next step'));
  expect(cta?.getAttribute('href')).toBe('#decision-helper');
  expect(host.querySelectorAll('h1')).toHaveLength(1);
});
