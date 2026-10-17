import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { AccessibleDialog } from '../components/AccessibleDialog';
import { SevenDayPause } from '../components/SevenDayPause';
import { WhatWouldYouDo } from '../components/WhatWouldYouDo';
import { STORAGE_KEY_COMPLETED, STORAGE_KEY_NOTES } from '../utils/storage';

let host: HTMLDivElement;
let root: Root;
const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  localStorage.clear(); sessionStorage.clear();
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  HTMLElement.prototype.scrollIntoView = vi.fn();
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalScrollIntoView) HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
});
async function render(node: ReactNode) { await act(async () => root.render(node)); }
async function click(element: Element) { await act(async () => (element as HTMLElement).click()); }
function button(text: string, scope: ParentNode = document) {
  const result = Array.from(scope.querySelectorAll('button')).find(el => el.textContent?.includes(text));
  if (!result) throw new Error(`Missing button: ${text}`);
  return result;
}

describe('real application interactions', () => {

  it('dismisses the drawer when focus leaves it without stealing the new focus', async () => {
    await render(<App />);
    await click(host.querySelector('[aria-label="Toggle navigation menu"]')!);
    const inside = button('Sources & Methodology', host.querySelector('#mobile-navigation-menu')!);
    await act(async () => inside.focus());
    expect(host.querySelector('#mobile-navigation-menu')).not.toBeNull();
    const outside = host.querySelector<HTMLButtonElement>('[aria-label^="Inspect Collar"]')!;
    await act(async () => outside.focus());
    expect(host.querySelector('#mobile-navigation-menu')).toBeNull();
    expect(document.activeElement).toBe(outside);
  });

  it('closes the drawer and focuses the hero when its home link is activated', async () => {
    await render(<App />);
    await click(host.querySelector('[aria-label="Toggle navigation menu"]')!);
    await click(host.querySelector('header [aria-label="Before Waste home"]')!);
    expect(host.querySelector('#mobile-navigation-menu')).toBeNull();
    expect(document.activeElement).toBe(host.querySelector('#hero'));
  });

  it('brings the new chapter into view after Next and Previous', async () => {
    await render(<App />);
    const heading = host.querySelector<HTMLHeadingElement>('#story-stage-title')!;
    expect(document.activeElement).not.toBe(heading);
    await click(button('Next: Becoming'));
    expect(heading.textContent).toContain('People, looms');
    expect(document.activeElement).toBe(heading);
    expect(heading.scrollIntoView).toHaveBeenLastCalledWith({ block: 'start', behavior: 'smooth' });
    await click(button('Previous Stage'));
    expect(heading.textContent).toContain('Before it was a T-shirt');
    expect(document.activeElement).toBe(heading);
  });

  it('uses immediate chapter scrolling when reduced motion is preferred', async () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    await render(<App />);
    await click(button('Next: Becoming'));
    expect(host.querySelector('#story-stage-title')?.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'auto' });
  });

  it('orients readers to the new object after finishing a journey', async () => {
    await render(<App />);
    await click(host.querySelector('[aria-label^="Stage 5:"]')!);
    await click(button('Explore Another Object'));
    const heading = host.querySelector('#story-stage-title')!;
    expect(heading.textContent).toContain("Extracted from the Earth's crust");
    expect(document.activeElement).toBe(heading);
    expect(host.querySelector('[aria-current="step"]')?.getAttribute('aria-label')).toContain('Stage 1');
  });

  it('provides a skip target, shared accessible home links, and named story illustrations', async () => {
    await render(<App />);
    expect(host.querySelector('.skip-link')?.getAttribute('href')).toBe('#main-content');
    expect(host.querySelector('#main-content')?.getAttribute('tabindex')).toBe('-1');
    expect(host.querySelectorAll('a[aria-label="Before Waste home"]')).toHaveLength(2);
    expect(Array.from(host.querySelectorAll('.brand-mark')).every(el => el.getAttribute('alt') === '')).toBe(true);
    expect(host.querySelector('svg[role="img"][aria-label^="Cotton T-Shirt:"]')).not.toBeNull();
  });

  it('closes mobile navigation on Escape and returns focus to its toggle', async () => {
    await render(<App />);
    const toggle = host.querySelector<HTMLButtonElement>('[aria-label="Toggle navigation menu"]')!;
    await click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(host.querySelector('#mobile-navigation-menu')).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });

  it('focuses the selected destination and closes the navigation drawer', async () => {
    await render(<App />);
    await click(host.querySelector('[aria-label="Toggle navigation menu"]')!);
    const link = host.querySelector('#mobile-navigation-menu a[href="/#pause"]')!;
    await click(link);
    expect(host.querySelector('#mobile-navigation-menu')).toBeNull();
    expect(document.activeElement).toBe(host.querySelector('#pause'));
  });

  it('dismisses the menu when pressing outside the header', async () => {
    await render(<App />);
    await click(host.querySelector('[aria-label="Toggle navigation menu"]')!);
    await act(async () => host.querySelector('main')!.dispatchEvent(new Event('pointerdown', { bubbles: true })));
    expect(host.querySelector('#mobile-navigation-menu')).toBeNull();
  });

  it('announces a newly selected hotspot and offers a multiline reflection field', async () => {
    await render(<App />);
    await click(host.querySelector('[aria-label^="Inspect Bottom Hem"]')!);
    const details = host.querySelector('#hotspot-details')!;
    expect(details.getAttribute('aria-live')).toBe('polite');
    expect(details.textContent).toContain('Wear & care');
    expect(host.querySelector('#reflection-note-day-1')?.getAttribute('rows')).toBe('3');
  });

  it('selects scenario radio cards with arrows, wraps, and supports Home/End', async () => {
    await render(<WhatWouldYouDo />);
    const radios = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
    const initial = radios.findIndex(el => el.getAttribute('aria-checked') === 'true');
    radios[initial].focus();
    for (const [key, index] of [['ArrowRight', (initial + 1) % radios.length], ['End', radios.length - 1], ['ArrowRight', 0], ['Home', 0], ['ArrowLeft', radios.length - 1]] as const) {
      await act(async () => document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })));
      expect(document.activeElement).toBe(radios[index]);
      expect(radios[index].getAttribute('aria-checked')).toBe('true');
      expect(radios.filter(el => el.tabIndex === 0)).toHaveLength(1);
    }
  });

  it('restarts the actual T-shirt story without clearing saved reflections', async () => {
    localStorage.setItem(STORAGE_KEY_COMPLETED, '[1,2]');
    localStorage.setItem(STORAGE_KEY_NOTES, '{"1":"Borrowed a book"}');
    await render(<App />);
    await click(host.querySelector('[aria-label^="Stage 5:"]')!);
    expect(host.querySelector('[aria-current="step"]')?.getAttribute('aria-label')).toContain('Stage 5');
    await click(button('Restart the story'));
    expect(document.activeElement).toBe(host.querySelector('#hero'));
    expect(host.querySelector('[aria-current="step"]')?.getAttribute('aria-label')).toContain('Stage 1');
    expect(host.querySelector('#object-tab-tshirt')?.getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem(STORAGE_KEY_COMPLETED)).toBe('[1,2]');
    expect(localStorage.getItem(STORAGE_KEY_NOTES)).toContain('Borrowed a book');
  });

  it('keeps object, country, scenario, and model selectors keyboard reachable', async () => {
    await render(<App />);
    for (const label of ['Select an object to follow', 'Select a scenario', 'Economic model comparison']) {
      const group = host.querySelector(`[role="group"][aria-label="${label}"]`)!;
      const controls = Array.from(group.querySelectorAll<HTMLButtonElement>('button'));
      expect(controls.every(control => control.tabIndex === 0)).toBe(true);
      await click(controls[controls.length - 1]);
      expect(controls[controls.length - 1].getAttribute('aria-pressed')).toBe('true');
      expect(group.querySelectorAll('[aria-pressed="true"]')).toHaveLength(1);
    }
    const countries = host.querySelector('[role="group"][aria-labelledby="country-tabs-label"]')!;
    const lastCountry = Array.from(countries.querySelectorAll<HTMLButtonElement>('button')).at(-1)!;
    expect(lastCountry.tabIndex).toBe(0);
    await click(lastCountry);
    expect(lastCountry.getAttribute('aria-pressed')).toBe('true');
  });

  it('opens the actual dialog, traps focus, restores inert state, and handles Escape', async () => {
    const close = vi.fn();
    const trigger = document.createElement('button');
    host.append(trigger);
    trigger.focus();
    await render(<AccessibleDialog isOpen onClose={close} titleId="test-title" title="Test"><button>Last control</button></AccessibleDialog>);
    const dialog = document.querySelector('[role="dialog"]')!;
    const first = button('', dialog);
    const last = button('Last control', dialog);
    expect(document.activeElement).toBe(first);
    expect(host.inert).toBe(true);
    last.focus();
    await act(async () => last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })));
    expect(document.activeElement).toBe(first);
    await act(async () => first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })));
    expect(document.activeElement).toBe(last);
    await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(close).toHaveBeenCalledOnce();
    await render(null);
    expect(host.inert).toBeFalsy();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('returns focus to the mobile menu toggle after closing Sources', async () => {
    await render(<App />);
    const toggle = host.querySelector<HTMLButtonElement>('[aria-label="Toggle navigation menu"]')!;
    await click(toggle);
    await click(button('Sources & Methodology', host.querySelector('#mobile-navigation-menu')!));
    expect(host.querySelector('#mobile-navigation-menu')).toBeNull();
    await click(document.querySelector('[aria-label="Close dialog"]')!);
    expect(document.activeElement).toBe(toggle);
    expect(host.inert).toBeFalsy();
  });

  it('recovers malformed stored data and exposes reset for notes alone', async () => {
    localStorage.setItem(STORAGE_KEY_COMPLETED, '{broken');
    localStorage.setItem(STORAGE_KEY_NOTES, '{"1":"Keep this note","9":"ignore"}');
    await render(<SevenDayPause />);
    expect(host.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe('Keep this note');
    expect(host.querySelector('[aria-checked="true"]')).toBeNull();
    await click(button('Reset Progress'));
    await click(button('Yes, Reset All'));
    expect(localStorage.getItem(STORAGE_KEY_NOTES)).toBeNull();
    expect(host.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe('');
    expect(document.activeElement?.getAttribute('aria-label')).toBe('7-Day Pause progress');
  });

  it('does not claim successful saving after a storage write fails', async () => {
    await render(<SevenDayPause />);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Quota exceeded'); });
    await click(host.querySelector('[role="checkbox"]')!);
    expect(host.textContent).toContain('Unable to save progress');
    expect(host.textContent).not.toContain('Saved privately on this browser only.');
  });

  it('keeps reflections visible and reports a failed reset', async () => {
    localStorage.setItem(STORAGE_KEY_NOTES, '{"1":"Do not lose this note"}');
    await render(<SevenDayPause />);
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('Storage blocked'); });
    await click(button('Reset Progress'));
    await click(button('Yes, Reset All'));
    expect(host.textContent).toContain('Unable to clear saved reflections');
    expect(host.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe('Do not lose this note');
    expect(localStorage.getItem(STORAGE_KEY_NOTES)).toContain('Do not lose this note');
  });
});


it('connects primary calls to action and trust details to working destinations', async () => {
  await act(async () => root.render(<App />));
  const primary = [...host.querySelectorAll('a')].filter(a => a.textContent?.trim() === 'Ask Before Waste');
  expect(primary.length).toBeGreaterThanOrEqual(3);
  for (const link of primary) expect(link.getAttribute('href')).toBe('/ask');
  const trust = host.querySelector('#how-it-works')!;
  const preview = host.querySelector('#object-preview')!;
  expect(preview.compareDocumentPosition(trust) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(trust.textContent).toContain('external AI service');
  expect(trust.textContent).toContain('not endorsements');
  expect(trust.textContent).toContain('clearing browser data removes them');
  await click(button('Check sources & methodology'));
  expect(document.querySelector('[role="dialog"]')?.textContent).toContain('do not endorse this project or verify individual AI answers');
  const sourceLinks = [...document.querySelectorAll('[role="dialog"] a[target="_blank"]')];
  expect(sourceLinks.length).toBeGreaterThan(0);
  for (const link of sourceLinks) expect(link.getAttribute('aria-label')).toContain('opens in a new tab');
});
