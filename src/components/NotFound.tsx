import { Compass, ArrowUpRight } from 'lucide-react';

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sage text-forest">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-clay">404</p>
      <h1 className="mt-3 font-editorial text-3xl font-normal leading-tight text-ink sm:text-4xl lg:text-5xl">
        This page doesn&apos;t exist&nbsp;&mdash;&nbsp;yet.
      </h1>
      <p className="mt-4 max-w-xl text-base text-ink/75 sm:text-lg">
        The link you followed may be broken, or the page may have moved. Let&apos;s get you back to the stories.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-forest-strong focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink"
        >
          <span>Back to the homepage</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href="/ask"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ink"
        >
          Ask Before Waste
        </a>
      </div>
    </div>
  );
}
