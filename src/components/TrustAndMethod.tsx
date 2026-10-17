import { BookOpen, MessageCircle, Bookmark } from 'lucide-react';

export function TrustAndMethod({ onOpenSources }: { onOpenSources: (trigger?: HTMLElement | null) => void }) {
  return <section id="how-it-works" tabIndex={-1} aria-labelledby="trust-title" className="scroll-mt-20 border-b border-ink/10 bg-paper py-10 sm:py-14">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p className="section-kicker text-forest">WHAT TO EXPECT</p>
      <h2 id="trust-title" className="mt-3 text-2xl sm:text-3xl font-editorial">A little guidance. You make the decision.</h2>
      <ol className="mt-6 grid gap-5 md:grid-cols-3">
        <li className="rounded-2xl border border-ink/15 bg-surface p-5"><MessageCircle aria-hidden="true" className="h-5 w-5 text-forest" /><h3 className="mt-3 font-semibold">1. Ask with your context</h3><p className="mt-2 text-sm leading-relaxed">No account needed. Your question, optional location and selected details go to an external AI service only when you request guidance. Leave out private information.</p></li>
        <li className="rounded-2xl border border-ink/15 bg-surface p-5"><BookOpen aria-hidden="true" className="h-5 w-5 text-forest" /><h3 className="mt-3 font-semibold">2. Review and check</h3><p className="mt-2 text-sm leading-relaxed">AI drafts can be wrong. Check linked resources, item-specific instructions and local rules. Listed resources are references, not endorsements or proof of every AI claim.</p></li>
        <li className="rounded-2xl border border-ink/15 bg-surface p-5"><Bookmark aria-hidden="true" className="h-5 w-5 text-forest" /><h3 className="mt-3 font-semibold">3. Keep one realistic step</h3><p className="mt-2 text-sm leading-relaxed">Edit, copy or save the action you choose. Saved actions and reflections stay in this browser when storage works; clearing browser data removes them. Nothing is booked or bought for you.</p></li>
      </ol>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-ink/80">An independent educational project. Environmental stories use published references; AI answers are drafts, and local services are not checked live.</p>
        <button type="button" onClick={event => onOpenSources(event.currentTarget)} className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl border border-forest px-4 py-3 text-sm font-semibold text-forest hover:bg-sage">Check sources &amp; methodology</button>
      </div>
    </div>
  </section>;
}
