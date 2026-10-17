# Brand and UX checks

The vector mark represents a circular path and new growth. `Brand.tsx` shares the
same mark and live-text wordmark between header and footer; the SVG is also the favicon.
Decorative logo images have empty alt text and their home links have accessible names.

## Verified in the local Chromium preview

- Layout widths: 280, 320, 360, 375, 390, 414, 640, 768, 820, 1024, 1280, 1440,
  1920, and 2560 CSS pixels. No horizontal page overflow or overlapping header zones.
- 844 × 390 landscape: the mobile navigation fits the available height and scrolls.
- 320 × 568: Sources dialog contains keyboard focus and its content scrolls.
- Escape dismisses mobile navigation and returns focus to the menu toggle.
- Skip to content transfers keyboard focus to the main landmark.
- Logo assets load in both header and footer.
- Reflection fields use multiline native controls with 16px text at the normal font setting.

## Material-inspired theme

Warm paper and cream surfaces evoke the materials in the stories. Forest teal is
reserved for primary actions and selection; terracotta provides restrained editorial
emphasis and caution. Sage and oat surfaces support context without competing with
controls. Illustrations retain material colors such as soil, cotton, fruit, and cardboard.
Semantic UI tokens live in `src/index.css`; scene tints live in `src/utils/theme.ts`.

White on forest has approximately 8.10:1 contrast, white on terracotta 5.87:1,
and ink on paper 10.98:1. Automated contrast checks cover key text/surface pairs,
action hover states, and muted text. These are color-pair checks, not a full audit.

## Navigation follow-up

The non-modal mobile drawer dismisses when focus leaves the header and when the
home link is used. Explicit Next/Previous and Explore Another Object actions focus
the new chapter heading before its illustration and text. Reduced-motion users get
immediate scrolling; other users get smooth scrolling. Initial rendering and object
selection from the top chooser do not move focus automatically.

Hotspots keep fixed 44px targets. At 280, 320, 375, 768, and 1440px, circular hit
areas do not overlap; the smallest measured gap is 1.5px at 280px. The 320x568
browser check places the focused chapter heading at 80px, below the 65px sticky
header. Tabbing beyond the drawer preserves focus on the now-visible next control.

## Automated checks

`npm run lint`, `npm test`, and `npm run build`. The component suite covers real
navigation dismissal, destination focus, skip-link wiring, accessible branding,
hotspot updates, keyboard scenario selection, dialog focus, restart, and reflection
storage failures.

## Object decision MVP

The homepage offers a practical decision flow alongside story exploration. Two
categories (clothes/headphones) and three intentions (buy/fix/pass on) provide six
starting situations. Budget and preferred help adjust the advice. These are
editorial starting points, not diagnoses, service availability promises or impact
calculations. External iFixit clothing/headphone category links were checked on
2026-10-17; local collection acceptance must be verified by the user.

One saved action, an optional note and its reported outcome live in a separate,
versioned browser-storage key. Existing seven-day reflections are preserved.
Storage failures retain session state and failed removal keeps the action visible.
Saving another recommendation explicitly replaces the current action and note.
No account, analytics, notification delivery or local service directory is added.

45 tests cover all six starting situations, budget/help branches, stale-result
clearing, storage validation/failure, restoration, outcome updates and removal.
Browser checks at 280, 320, 375, 768, 1280 and 1440px found no page overflow;
320px and 1440px layouts were visually inspected. Result submission moves focus
to its card; story links transfer focus to the story section.

## Accessibility review scope

Use the [WCAG 2.2 reference](https://www.w3.org/WAI/WCAG22/quickref/) when reviewing
future changes, including reflow, text resize, visible focus, keyboard access, and
target size. This work is not a formal accessibility certification. Safari/Firefox,
physical-device testing, text-only zoom, and a full screen-reader audit remain
release checks. Browser viewport checks do not replace those checks.
