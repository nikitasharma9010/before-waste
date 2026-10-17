import { useEffect } from 'react';

/** Preserve old section links even when the target is inside optional learning. */
export function useSectionNavigation() {
  useEffect(() => {
    function reveal() {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      for (let parent: HTMLElement | null = target; parent; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
      }
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.scrollIntoView?.({ block: 'start', behavior: 'auto' });
    }
    reveal();
    window.addEventListener('hashchange', reveal);
    // Clicking an already-current hash should reopen a collapsed optional section too.
    function onClick(event: MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(anchor.href);
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash === location.hash && url.hash) reveal();
    }
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('hashchange', reveal); document.removeEventListener('click', onClick); };
  }, []);
}
