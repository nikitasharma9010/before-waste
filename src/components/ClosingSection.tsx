import { Brand } from './Brand';
import React, { useState } from 'react';
import { Share2, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ClosingSectionProps {
  onRestart: () => void;
  onOpenSources: (triggerEl?: HTMLElement | null) => void;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ onRestart, onOpenSources }) => {
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleShare = async () => {
    const shareData = {
      title: 'BEFORE WASTE — Think before it becomes waste',
      text: 'Everything we consume has a story before it reaches us, and another story after. An interactive exploration of the things we consume.',
      url: window.location.href
    };

    // If Web Share API is available
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        setShareFeedback('Shared successfully!');
        setTimeout(() => setShareFeedback(null), 3000);
        return;
      } catch (err: unknown) {
        // Treat user cancellation as a normal, expected outcome
        if (
          err instanceof Error &&
          (err.name === 'AbortError' || err.message.toLowerCase().includes('abort') || err.message.toLowerCase().includes('cancel'))
        ) {
          return;
        }
        // If native share failed for reasons other than cancellation, fall through to clipboard
      }
    }

    // Fallback: Copy URL to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareFeedback('Link copied to clipboard!');
        setTimeout(() => setShareFeedback(null), 3000);
      } catch {
        setShareFeedback('Could not copy link automatically.');
        setTimeout(() => setShareFeedback(null), 3000);
      }
    } else {
      setShareFeedback('Sharing not supported on this browser.');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  return (
    <footer id="closing" className="scroll-mt-20 pt-20 pb-16 bg-ink text-paper relative overflow-hidden">
      {/* Accessible live status for share notifications */}
      <div role="status" aria-live="polite" className="sr-only">
        {shareFeedback || ''}
      </div>

      {/* Soft gradient accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-b from-clay/15 via-forest/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Closing Editorial Reflection */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-oat">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>THE NEXT CHAPTER</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white text-balance">
            The next thing you buy already has a story.
          </h2>

          <p className="font-editorial text-2xl sm:text-3xl italic text-paper/85">
            “You get to be part of what happens next.”
          </p>

          <p className="text-sm sm:text-base text-paper/75 leading-relaxed max-w-xl mx-auto font-sans pt-2">
            You don&apos;t have to be perfect. You don&apos;t have to renounce everything you own. Simply carry a little more curiosity into the stores, markets, and drawers of your everyday life.
          </p>

          {/* Primary Action Button Bar */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 pt-4">
            <a
              href="#decision-helper"
              onClick={() => document.getElementById('decision-helper')?.focus({ preventScroll: true })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-xl font-bold text-sm text-ink bg-oat hover:bg-oat-strong focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white transition-all shadow-md cursor-pointer text-center"
            >
              <span>Ask Before Waste</span>
            </a>

            <a href="#pause" onClick={() => document.getElementById('pause')?.focus({ preventScroll: true })} className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/30 px-5 py-3.5 text-sm font-semibold text-white hover:bg-white/10">Try the 7-day pause</a>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[44px] rounded-xl font-semibold text-sm text-white/95 hover:text-white bg-surface/10 hover:bg-surface/20 focus-visible:ring-2 focus-visible:ring-white transition-colors cursor-pointer border border-white/15 text-center"
              aria-label="Share this story"
            >
              {shareFeedback ? (
                <Check className="w-4 h-4 text-oat" aria-hidden="true" />
              ) : (
                <Share2 className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{shareFeedback || 'Share Before Waste'}</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/15 pt-10 pb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <a href="#hero" aria-label="Before Waste home" className="inline-flex min-h-[44px] items-center rounded text-white">
              <Brand footer />
            </a>
            <span className="text-xs text-white/75">
              Think before it becomes waste.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/80">
            <button type="button" onClick={onRestart} aria-label="Restart journey and return to Cotton T-Shirt stage one" className="inline-flex min-h-[44px] items-center gap-2 py-2 hover:text-white"><RotateCcw aria-hidden="true" className="h-4 w-4" />Restart the story</button>
            <a href="#how-it-works" onClick={() => document.getElementById('how-it-works')?.focus({ preventScroll: true })} className="inline-flex min-h-[44px] items-center py-2 underline underline-offset-4">How it works &amp; your data</a>
            <a href="#hero" className="hover:text-white focus-visible:ring-2 focus-visible:ring-white px-1 py-2 min-h-[44px] inline-flex items-center rounded transition-colors">
              Top
            </a>
            <a href="#follow-one-thing" className="hover:text-white focus-visible:ring-2 focus-visible:ring-white px-1 py-2 min-h-[44px] inline-flex items-center rounded transition-colors">
              The 4 Objects
            </a>
            <a href="#bigger-pattern" className="hover:text-white focus-visible:ring-2 focus-visible:ring-white px-1 py-2 min-h-[44px] inline-flex items-center rounded transition-colors">
              The Pattern
            </a>
            <a href="#pause" className="hover:text-white focus-visible:ring-2 focus-visible:ring-white px-1 py-2 min-h-[44px] inline-flex items-center rounded transition-colors">
              7-Day Pause
            </a>
            <button
              type="button"
              onClick={(e) => onOpenSources(e.currentTarget)}
              className="hover:text-white focus-visible:ring-2 focus-visible:ring-white px-1 py-2 min-h-[44px] inline-flex items-center rounded transition-colors cursor-pointer underline underline-offset-4 decoration-white/40"
            >
              Sources & Methodology
            </button>
          </div>
        </div>

        {/* Quiet attribution */}
        <div className="text-center text-xs text-white/75 pt-2">
          <p>
            An independent educational exploration dedicated to mindful consumption and ecological curiosity.
          </p>
        </div>
      </div>
    </footer>
  );
};
