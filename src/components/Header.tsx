import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenSources: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSources }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Follow One Thing', href: '#follow-one-thing' },
    { label: 'The Pattern', href: '#bigger-pattern' },
    { label: 'What Would You Do?', href: '#what-would-you-do' },
    { label: 'One Planet', href: '#one-planet' },
    { label: 'The 7-Day Pause', href: '#pause' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F0]/95 backdrop-blur-md border-b border-[#202A35]/8">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in editorial face) */}
        <a
          href="#hero"
          className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-[#202A35] hover:text-[#FF654F] transition-colors whitespace-nowrap shrink-0"
        >
          BEFORE WASTE
        </a>

        {/* Zone 2: Navigation Links (Clean typography, whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#202A35]/80">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#202A35] hover:underline underline-offset-4 decoration-[#FF654F] decoration-2 transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onOpenSources}
            className="hover:text-[#202A35] hover:underline underline-offset-4 decoration-[#425BFF] decoration-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sources
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#follow-one-thing"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#202A35] hover:bg-[#FF654F] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <span>Start Exploring</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#202A35] hover:bg-[#202A35]/5 focus:outline-none focus:ring-2 focus:ring-[#FF654F]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF9F0] border-b border-[#202A35]/10 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="py-2.5 px-3 rounded-lg text-base font-medium text-[#202A35] hover:bg-[#202A35]/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSources();
              }}
              className="text-left py-2.5 px-3 rounded-lg text-base font-medium text-[#202A35]/70 hover:bg-[#202A35]/5 transition-colors cursor-pointer"
            >
              Sources & Methodology
            </button>
            <div className="pt-2">
              <a
                href="#follow-one-thing"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 text-center font-medium text-white bg-[#202A35] hover:bg-[#FF654F] rounded-lg transition-colors shadow-sm"
              >
                <span>Start Exploring</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
