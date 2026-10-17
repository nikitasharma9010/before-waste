import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { SiteFooter } from '../components/SiteFooter';

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
async function render(assistant = false) { await act(async () => root.render(<SiteFooter assistant={assistant} onRestart={() => {}} onOpenSources={() => {}} />)); }
async function share() { await act(async () => [...host.querySelectorAll('button')].find(b => b.textContent?.includes('Share Before Waste'))!.click()); }
it('uses consistent navigation with working cross-page targets on the assistant', async () => {
  await render(true);
  expect(host.querySelector('nav[aria-label="Footer explore"]')).not.toBeNull();
  expect(host.querySelector('a[href="/#follow-one-thing"]')).not.toBeNull();
  expect(host.querySelector('a[href="/#pause"]')).not.toBeNull();
  expect(host.querySelector('a[href="#how-it-works"]')).not.toBeNull();
  expect(host.querySelector('a[aria-current="page"]')?.getAttribute('href')).toBe('/ask');
  expect(host.textContent).not.toContain('Restart the story');
});
it('offers manual copying after a share failure and shows success only after copying succeeds', async () => {
  const copy = vi.fn().mockRejectedValueOnce(new Error('denied')).mockResolvedValueOnce(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText: copy } });
  await render(); await share();
  expect(host.querySelector('[role="status"]')?.textContent).toContain('Could not share');
  expect(host.querySelector('svg.lucide-check')).toBeNull();
  expect(host.querySelector(`a[href="${window.location.origin}/"]`)).not.toBeNull();
  await share();
  expect(host.querySelector('[role="status"]')?.textContent).toBe('Link copied.');
  expect(host.querySelector('svg.lucide-check')).not.toBeNull();
  expect(copy).toHaveBeenLastCalledWith(`${window.location.origin}/`);
});

it('treats cancelled native sharing as cancellation without copying', async () => {
  const copy = vi.fn();
  vi.stubGlobal('navigator', { share: vi.fn().mockRejectedValue(new DOMException('Cancelled', 'AbortError')), clipboard: { writeText: copy } });
  await render(); await share();
  expect(copy).not.toHaveBeenCalled();
  expect(host.querySelector('[role="status"]')?.textContent).toBe('');
  expect(host.querySelector('svg.lucide-check')).toBeNull();
});
