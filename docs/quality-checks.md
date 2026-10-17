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

## Automated checks

`npm run lint`, `npm test`, and `npm run build`. The component suite covers real
navigation dismissal, destination focus, skip-link wiring, accessible branding,
hotspot updates, keyboard scenario selection, dialog focus, restart, and reflection
storage failures.

## Scope

Use the [WCAG 2.2 reference](https://www.w3.org/WAI/WCAG22/quickref/) when reviewing
future changes, including reflow, text resize, visible focus, keyboard access, and
target size. This work is not a formal accessibility certification. Safari/Firefox,
physical-device testing, text-only zoom, and a full screen-reader audit remain
release checks. Browser viewport checks do not replace those checks.
