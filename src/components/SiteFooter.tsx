import { SITE_NAVIGATION } from '../data/siteNavigation';
import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { Brand } from './Brand';

const link = 'inline-flex min-h-[44px] items-center rounded py-2 text-sm text-paper/85 underline-offset-4 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-oat';
type ShareFeedback = { kind: 'success' | 'error'; message: string } | null;

export function SiteFooter({ assistant = false, onRestart, onOpenSources }: {
  assistant?: boolean;
  onRestart: () => void;
  onOpenSources: (triggerEl?: HTMLElement | null) => void;
}) {
  const [feedback, setFeedback] = useState<ShareFeedback>(null);
  const [sharing, setSharing] = useState(false);
  const home = assistant ? '/' : '';
  const shareUrl = new URL('/', window.location.origin).href;
  async function share() {
    if (sharing) return;
    setSharing(true); setFeedback(null);
    try {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({ title: 'Before Waste — Think before it becomes waste', text: 'Explore everyday objects and choose a practical next step to reduce waste.', url: shareUrl });
          setFeedback({ kind: 'success', message: 'Shared successfully.' }); return;
        } catch (error) {
          if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError') return;
        }
      }
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(shareUrl);
      setFeedback({ kind: 'success', message: 'Link copied.' });
    } catch {
      setFeedback({ kind: 'error', message: 'Could not share automatically. Select and copy the link below.' });
    } finally { setSharing(false); }
  }
  return <footer className="border-t border-white/15 bg-ink px-4 py-8 text-paper sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <a href={`${home}#hero`} aria-label="Before Waste home" className="inline-flex min-h-[44px] items-center rounded focus-visible:ring-2 focus-visible:ring-oat"><Brand footer /></a>
          <p className="mt-3 text-sm text-paper/85">Think before it becomes waste.</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-paper/75">An independent educational project about everyday consumption and practical lower-waste choices.</p>
        </div>
        <nav aria-label="Footer explore">
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-2">
            {SITE_NAVIGATION.map(destination => <li key={destination.href}><a href={destination.href} aria-current={assistant && destination.href === '/ask' ? 'page' : undefined} className={link}>{destination.label}</a></li>)}
          </ul>
        </nav>
        <nav aria-label="Footer about">
          <h2 className="text-sm font-semibold text-white">About this project</h2>
          <ul className="mt-2">
            <li><a href="#how-it-works" className={link}>How it works &amp; your data</a></li>
            <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSfuQbhpDFuQXq2N9SQue6fF-coyQaDuZ9K6UDpj_X4Rh3Y2OA/viewform" className={link}>Share feedback</a></li>
            <li><button type="button" className={`${link} text-left`} onClick={event => onOpenSources(event.currentTarget)}>Sources &amp; Methodology</button></li>
          </ul>
          <button type="button" disabled={sharing} onClick={() => void share()} className={`${link} gap-2 text-left disabled:opacity-60`}>
            {feedback?.kind === 'success' ? <Check aria-hidden="true" className="h-4 w-4 shrink-0" /> : <Share2 aria-hidden="true" className="h-4 w-4 shrink-0" />}
            {sharing ? 'Sharing…' : 'Share Before Waste'}
          </button>
          <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-paper/85">{feedback?.message}</p>
          {feedback?.kind === 'error' && <a href={shareUrl} className={`${link} max-w-full break-all select-text`}>{shareUrl}</a>}
        </nav>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/15 pt-4">
        <p className="text-xs text-paper/75">Guidance to review. Local rules and services still need checking.</p>
        {assistant ? <a href="/#follow-one-thing" className={link}>Explore the object stories</a> : <button type="button" onClick={onRestart} aria-label="Restart journey and return to Cotton T-Shirt stage one" className={link}>Start over</button>}
      </div>
    </div>
  </footer>;
}

