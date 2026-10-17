import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DecisionHelper } from '../components/DecisionHelper';
import { recommend, type Item, type Intent } from '../data/decisionData';
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
  expect(host.querySelector('[role="status"]')?.textContent).toContain('session only');
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked'); });
  await click('Remove saved action');
  expect(host.querySelector('#saved-action-title')).not.toBeNull();
  expect(host.querySelector('[role="status"]')?.textContent).toContain('could not be removed');
});
it('rejects untrusted stored shapes', () => {
  localStorage.setItem(ACTION_KEY, JSON.stringify({ item: 'unknown', intent: 'fix' }));
  expect(readAction().action).toBeNull();
  localStorage.setItem(ACTION_KEY, JSON.stringify({ item: ['clothes'], intent: 'fix', support: 'help', budget: 'free', outcome: 'planned', note: '' }));
  expect(readAction().action).toBeNull();
});
