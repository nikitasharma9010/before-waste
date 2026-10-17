export function Welcome({ onExploreObjects }: { onExploreObjects: (id: string) => void }) {
  return <section id="hero" tabIndex={-1} aria-labelledby="welcome-title" className="scroll-mt-20 py-10 sm:py-14 lg:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="section-kicker text-ink/75 mb-4">BEFORE WASTE · EVERYDAY OBJECTS. THOUGHTFUL NEXT STEPS.</p>
      <h1 id="welcome-title" className="max-w-4xl font-editorial text-3xl sm:text-5xl lg:text-6xl leading-[1.15] text-balance">Before it becomes waste, <span className="italic font-semibold text-clay">what comes next?</span></h1>
      <p className="mt-5 text-lg leading-relaxed max-w-2xl">Find a practical next step before buying, replacing or letting something go. Ask about any item, reducing waste or sustainable living, at your own pace.</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <a href="/ask"  className="inline-flex justify-center items-center min-h-[44px] px-5 py-3 rounded-xl bg-forest text-white font-semibold hover:bg-forest-strong">Ask Before Waste</a>
        <a href="#follow-one-thing" onClick={() => onExploreObjects('tshirt')} className="inline-flex justify-center items-center min-h-[44px] px-5 py-3 rounded-xl border border-ink/25 font-semibold hover:bg-sage">Explore an object’s story</a>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink/80" aria-label="Before you start">
        <span>No account needed</span><span>Review before saving</span>
        <a href="#how-it-works" onClick={() => document.getElementById('how-it-works')?.focus({ preventScroll: true })} className="inline-flex min-h-[44px] items-center font-semibold text-forest underline underline-offset-4">How it works &amp; your data</a>
      </div>
    </div>
  </section>;
}
