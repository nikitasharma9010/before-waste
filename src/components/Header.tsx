import { SITE_NAVIGATION } from '../data/siteNavigation';
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Brand } from './Brand';

interface HeaderProps {
  onOpenSources: (triggerEl?: HTMLElement | null) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSources }) => {
  const isAssistant = /^\/ask\/?$/.test(window.location.pathname);
  const [sectionHash, setSectionHash] = useState(window.location.hash);
  useEffect(() => {
    const update = () => setSectionHash(window.location.hash);
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => { window.removeEventListener('hashchange', update); window.removeEventListener('popstate', update); };
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sourcesButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMobileMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1280px)');
    const closeOnDesktop = () => { if (desktop.matches) setMobileMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    desktop.addEventListener?.('change', closeOnDesktop);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
      desktop.removeEventListener?.('change', closeOnDesktop);
    };
  }, [mobileMenuOpen]);

  const navLinks = SITE_NAVIGATION;
  const activeSection = ['#bigger-pattern', '#one-planet', '#systems'].includes(sectionHash) ? '#learn' : sectionHash === '#object-preview' ? '#follow-one-thing' : sectionHash;
  const currentDestination = (href: string) => href === '/ask' && isAssistant ? 'page' as const
    : !isAssistant && href === `/${activeSection}` ? 'location' as const : undefined;

  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <header
      ref={headerRef}
      onBlur={(event) => {
        // This is a non-modal disclosure: let Tab leave naturally, then dismiss it.
        if (!event.currentTarget.contains(event.relatedTarget)) setMobileMenuOpen(false);
      }}
      className="sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b border-ink/10"
    >
      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/#hero"
          onClick={handleLinkClick}
          aria-label="Before Waste home"
          className="inline-flex items-center min-h-[44px] min-w-0 text-ink hover:text-clay rounded transition-colors"
        >
          <Brand />
        </a>

        {/* Zone 2: Navigation Links (Only shown when width is comfortable) */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex items-center gap-6 text-sm font-medium text-ink/85"
        >
          {navLinks.filter(link => link.href !== '/ask' || isAssistant).map((link) => (
            <a
              key={link.href}
              aria-current={currentDestination(link.href)}
              href={link.href}
              onClick={handleLinkClick}
              className="inline-flex items-center min-h-[44px] py-2 hover:text-ink hover:underline underline-offset-4 decoration-clay decoration-2 focus-visible:ring-2 focus-visible:ring-ink rounded transition-colors whitespace-nowrap shrink-0 aria-[current=location]:font-semibold aria-[current=location]:underline aria-[current=page]:font-semibold aria-[current=page]:text-forest aria-[current=page]:underline aria-[current=page]:decoration-forest"
            >
              {link.label}
            </a>
          ))}
          <button
            ref={sourcesButtonRef}
            type="button"
            onClick={() => onOpenSources(sourcesButtonRef.current)}
            className="inline-flex items-center min-h-[44px] py-2 hover:text-ink hover:underline underline-offset-4 decoration-forest decoration-2 focus-visible:ring-2 focus-visible:ring-ink rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sources
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isAssistant && <a
            href="/ask"
            onClick={handleLinkClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] text-sm font-semibold text-white bg-forest hover:bg-forest-strong focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <span>Ask Before Waste</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>}

          {/* Mobile Menu Button (Accessible min 44x44 target) */}
          <button
            type="button"
            ref={menuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-ink hover:bg-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="mobile-navigation xl:hidden bg-paper border-b border-ink/15 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
            {navLinks.filter(link => link.href !== '/ask' || isAssistant).map((link) => (
              <a
                key={link.href}
                aria-current={currentDestination(link.href)}
                href={link.href}
                onClick={handleLinkClick}
                className="py-3 px-4 min-h-[44px] flex items-center rounded-xl aria-[current=page]:bg-sage aria-[current=location]:font-semibold aria-[current=location]:underline aria-[current=page]:font-semibold text-base font-medium text-ink hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ink transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSources(menuButtonRef.current);
              }}
              className="text-left py-3 px-4 min-h-[44px] flex items-center rounded-xl text-base font-medium text-ink/80 hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ink transition-colors cursor-pointer"
            >
              Sources & Methodology
            </button>
            {!isAssistant && <div className="pt-2">
              <a
                href="/ask"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 min-h-[44px] text-center font-semibold text-white bg-forest hover:bg-forest-strong focus-visible:ring-2 focus-visible:ring-ink rounded-xl transition-colors shadow-xs"
              >
                <span>Ask Before Waste</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>}
          </nav>
        </div>
      )}
    </header>
  );
};
