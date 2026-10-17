import { ArrowRight } from 'lucide-react';

/** Homepage closing invitation; navigation and utility actions live in SiteFooter. */
export function ClosingSection() {
  return <section id="closing" aria-labelledby="closing-title" className="scroll-mt-20 bg-ink px-4 py-8 text-paper sm:px-6 sm:py-10 lg:px-8">
    <div className="mx-auto max-w-3xl text-center">
      <p className="section-kicker text-oat">THE NEXT CHAPTER</p>
      <h2 id="closing-title" className="mt-4 font-editorial text-2xl leading-tight text-white sm:text-3xl">Choose what happens next.</h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-paper/85">Start with something you already own. Ask a question, explore your options and choose one realistic action.</p>
      <a href="/ask" className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-oat px-6 py-3 font-semibold text-ink hover:bg-oat-strong focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink">Ask Before Waste<ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
    </div>
  </section>;
}
