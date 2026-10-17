import { useEffect } from 'react';

/** Preserve old section links even when the target is inside a learning topic. */
export function useSectionNavigation() {
  useEffect(() => {
    function reveal(smooth = false) {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      if (target.closest('[data-learning-panel][hidden]')) target.dispatchEvent(new Event('section-reveal', { bubbles: true }));
      for (let parent: HTMLElement | null = target; parent; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) {
          const group = parent.getAttribute('name');
          if (group) document.querySelectorAll<HTMLDetailsElement>('details[name]').forEach(detail => {
            if (detail !== parent && detail.getAttribute('name') === group) detail.open = false;
          });
          parent.open = true;
        }
      }
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.scrollIntoView?.({ block: 'start', behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
    }
    reveal();
    const onHashChange = () => reveal(true);
    window.addEventListener('hashchange', onHashChange);
    // Clicking an already-current hash should reopen a collapsed section too.
    function onClick(event: MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self') || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(anchor.href);
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) {
        let targetId: string;
        try { targetId = decodeURIComponent(url.hash.slice(1)); } catch { return; }
        if (!document.getElementById(targetId)) return;
        event.preventDefault();
        if (url.hash !== location.hash) {
          window.history.pushState(null, '', url.hash);
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        } else reveal(true);
      }
    }
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('hashchange', onHashChange); document.removeEventListener('click', onClick); };
  }, []);
}
