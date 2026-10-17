import React, { useState } from 'react';
import { ArrowUp, Share2, RotateCcw, Check, Heart, Sparkles } from 'lucide-react';

interface ClosingSectionProps {
  onRestart: () => void;
  onOpenSources: () => void;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ onRestart, onOpenSources }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'BEFORE WASTE — Think before it becomes waste',
      text: 'Everything we consume has a story before it reaches us, and another story after. An interactive exploration of the things we consume.',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.warn('Clipboard write failed');
      }
    }
  };

  return (
    <footer className="pt-20 pb-16 bg-[#202A35] text-[#FFF9F0] relative overflow-hidden">
      {/* Soft gradient accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-b from-[#FF654F]/10 via-[#425BFF]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Closing Editorial Reflection */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#FFC857]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE NEXT CHAPTER</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white text-balance">
            The next thing you buy already has a story.
          </h2>

          <p className="font-editorial text-2xl sm:text-3xl italic text-[#FFF9F0]/80">
            “You get to be part of what happens next.”
          </p>

          <p className="text-sm sm:text-base text-[#FFF9F0]/70 leading-relaxed max-w-xl mx-auto font-sans pt-2">
            You don&apos;t have to be perfect. You don&apos;t have to renounce everything you own. Simply carry a little more curiosity into the stores, markets, and drawers of your everyday life.
          </p>

          {/* Primary Action Button */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#pause"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-[#202A35] bg-[#FFC857] hover:bg-[#ffbe3b] transition-all shadow-md cursor-pointer"
            >
              <span>Pause before the next thing</span>
            </a>

            <button
              onClick={onRestart}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Explore from the beginning</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#0D9F91]" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Perspective'}</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-10 pb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <span className="font-editorial text-xl font-bold tracking-tight text-white">
              BEFORE WASTE
            </span>
            <span className="text-xs text-white/50">
              Think before it becomes waste.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/70">
            <a href="#hero" className="hover:text-white transition-colors">
              Top
            </a>
            <a href="#follow-one-thing" className="hover:text-white transition-colors">
              The 4 Objects
            </a>
            <a href="#bigger-pattern" className="hover:text-white transition-colors">
              The Pattern
            </a>
            <a href="#pause" className="hover:text-white transition-colors">
              7-Day Pause
            </a>
            <button
              onClick={onOpenSources}
              className="hover:text-white transition-colors cursor-pointer underline underline-offset-4 decoration-white/40"
            >
              Sources & Methodology
            </button>
          </div>
        </div>

        {/* Quiet attribution */}
        <div className="text-center text-xs text-white/40 pt-4">
          <p>
            An independent educational exploration dedicated to mindful consumption and ecological curiosity.
          </p>
        </div>
      </div>
    </footer>
  );
};
