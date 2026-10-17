import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Brand } from './Brand';

interface HeaderProps {
  onOpenSources: (triggerEl?: HTMLElement | null) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSources }) => {
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

  const navLinks = [
    { label: 'Follow One Thing', href: '#follow-one-thing' },
    { label: 'The Pattern', href: '#bigger-pattern' },
    { label: 'What Would You Do?', href: '#what-would-you-do' },
    { label: 'One Planet', href: '#one-planet' },
    { label: 'The 7-Day Pause', href: '#pause' },
  ];

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    const target = document.getElementById(event.currentTarget.hash.slice(1));
    if (target) {
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-[#FFF9F0]/95 backdrop-blur-md border-b border-[#202A35]/10">
      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#hero"
          aria-label="Before Waste home"
          className="inline-flex items-center min-h-[44px] min-w-0 text-[#202A35] hover:text-[#C53B27] rounded transition-colors"
        >
          <Brand />
        </a>

        {/* Zone 2: Navigation Links (Only shown when width is comfortable) */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#202A35]/85"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex items-center min-h-[44px] py-2 hover:text-[#202A35] hover:underline underline-offset-4 decoration-[#C53B27] decoration-2 focus-visible:ring-2 focus-visible:ring-[#202A35] rounded transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
          <button
            ref={sourcesButtonRef}
            type="button"
            onClick={() => onOpenSources(sourcesButtonRef.current)}
            className="inline-flex items-center min-h-[44px] py-2 hover:text-[#202A35] hover:underline underline-offset-4 decoration-[#2840DE] decoration-2 focus-visible:ring-2 focus-visible:ring-[#202A35] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sources
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#follow-one-thing"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] text-sm font-semibold text-white bg-[#202A35] hover:bg-[#C53B27] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#202A35] rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <span>Start Exploring</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>

          {/* Mobile Menu Button (Accessible min 44x44 target) */}
          <button
            type="button"
            ref={menuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#202A35] hover:bg-[#202A35]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202A35] transition-colors"
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
          className="mobile-navigation xl:hidden bg-[#FFF9F0] border-b border-[#202A35]/15 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="py-3 px-4 min-h-[44px] flex items-center rounded-xl text-base font-medium text-[#202A35] hover:bg-[#202A35]/5 focus-visible:ring-2 focus-visible:ring-[#202A35] transition-colors"
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
              className="text-left py-3 px-4 min-h-[44px] flex items-center rounded-xl text-base font-medium text-[#202A35]/80 hover:bg-[#202A35]/5 focus-visible:ring-2 focus-visible:ring-[#202A35] transition-colors cursor-pointer"
            >
              Sources & Methodology
            </button>
            <div className="pt-2">
              <a
                href="#follow-one-thing"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 min-h-[44px] text-center font-semibold text-white bg-[#202A35] hover:bg-[#C53B27] focus-visible:ring-2 focus-visible:ring-[#202A35] rounded-xl transition-colors shadow-xs"
              >
                <span>Start Exploring</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
