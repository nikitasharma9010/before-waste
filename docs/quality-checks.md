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

## Decision-flow review fixes (2026-10-17)

The practical flow now follows a compact welcome, before the interactive object
preview. Header calls to action point to the decision flow; a saved-action shortcut
appears for returning visitors. At 320px the tool starts at approximately 600px,
compared with 2020px before this change. No page overflow was found at 280, 320,
375, 768, 1280 or 1440px.

Repair advice branches on missing buttons, open seams, small holes, audio output,
connections or ear pads, with an unsure fallback and a distinct ask-for-help path.
Changing item resets its issue. Older saved actions keep their notes and outcomes,
defaulting to an unsure issue; invalid optional issue/barrier values are discarded.

Saving an equivalent recommendation preserves its history. Replacing it explains
the effect and offers one session-only Undo snapshot. Removal moves keyboard focus
to the stable decision heading and supports Undo; failed storage removal keeps the
action shown. Browser checks confirmed Undo restores notes and outcomes and moves
focus to the saved heading. Undo history does not survive a reload.

Blocked outcomes offer cost/time/tools/access alternatives and retain the original
action and note. Relevant EPA reuse/electronics guidance is labelled US-specific;
local acceptance must be confirmed. Repair Café's directory is linked for repair
help without promising local coverage. Those external resources were checked on
2026-10-17. No location collection or automated directory lookup is added.

All 52 tests, TypeScript and production build pass. New tests cover history
preservation, replacement Undo, removal focus, barrier persistence, issue reset,
old-record compatibility, resource selection and the new page order. Browser
checks covered issue guidance, notes/outcome retention, Undo, focus and reload.

## AI planner implementation

The optional description flow calls a server-only Gemini endpoint. Requests and
plans are schema-validated; resources are resolved from a vetted catalogue. Plans
are explicitly marked AI-generated, safety guidance or basic non-AI guidance.
The accepted edited text is saved, not regenerated from the old recommendation
function on reload. Existing saved actions and reflection notes remain compatible.

66 tests cover provider-response parsing, API request validation and throttling,
quota/failure/timeout handling, deterministic safety, AI editing and storage,
clarification, cancellation, basic guidance and prior interactions. Browser checks
exercised unavailable-provider fallback and a labelled safety plan through the real
local handler, edited-plan restoration and reflow at six widths (280–1440px).
Live Gemini output quality requires a configured deployment and is not verified by
the simulated-provider tests. See `ai-demo-checklist.md` for that final check.

## AICredits failover

The server now supports auto, Gemini-only and AICredits-only modes. Auto skips
unconfigured providers and falls back once when Gemini is unavailable, times out,
hits quota or returns an invalid plan. Both attempts share a 20-second budget.
AICredits uses the documented chat-completions JSON-object contract and the same
plan validator/resource allowlist. Valid clarification does not spend backup
credits. UI disclosure covers both services and saved plans retain provenance.

74 tests pass, including credential separation, direct AICredits mode, missing
Gemini configuration, quota/malformed output fallback, primary timeout, provider-
only behavior, successful-primary short circuit and provider persistence. Live
AICredits wallet/model access and actual output remain to be tested after keys
are configured. See README.md and ai-demo-checklist.md.

## Remaining manual checks

Use the [WCAG 2.2 reference](https://www.w3.org/WAI/WCAG22/quickref/) when reviewing
future changes, including reflow, text resize, visible focus, keyboard access, and
target size. This work is not a formal accessibility certification. Safari/Firefox,
physical-device testing, text-only zoom, and a full screen-reader audit remain
release checks. Browser viewport checks do not replace those checks.

## Open sustainability questions — 17 October 2026

- 79 automated tests pass; TypeScript check and production build pass.
- Free questions are the default. Guided clothing/headphone flows and old saved actions remain supported.
- Tested description-only API input, conceptual answers, absent catalogue matches, open-plan save/reload, honest fallback and device battery safeguarding. Provider responses in automated tests are simulated.
- Browser checked at widths 280, 320, 375, 768, 1280 and 1440: no document horizontal overflow. Desktop and 375px layouts visually inspected. Missing-key behavior confirmed through the local API.
- Live Gemini/AICredits output quality and production deployment still require configured Vercel credentials and the deployment demo checks.

## AI assistance usability — 17 October 2026

The question input is now a separate labelled form: Enter adds a newline and Ctrl/Cmd+Enter submits AI guidance. The basic-guidance button has a separate explicit action. Optional starter questions fill the field without sending a request. Short-input errors are linked to the field, identify the minimum, and focus it; service errors retain the question and expose retry. Loading has a polite live status, reduced-motion-aware spinner and cancellation that restores focus. No invented progress percentage is displayed.

AI answers identify their original question and provide a direct edit/clarification control. Editing or retry failure preserves the current reviewed draft; only a successful new answer replaces it. Copying a draft does not require saving. Privacy details use a native disclosure with a visible short summary. Existing visible focus styles and 44px control minimums are retained; input text is 16px.

Validation: 84 tests pass, TypeScript and production build pass. Browser verified inline validation, Ctrl+Enter, missing-key recovery, original-question context and edit focus. No horizontal overflow at 280, 320, 375, 768, 1280 and 1440px; desktop and 375px layouts visually inspected. The preview uses deterministic safety guidance, explicitly labelled as not AI-generated. Real provider quality, physical-device keyboard behavior and screen-reader testing remain deployment checks; this is not a complete WCAG conformance audit or usability study.

References: [W3C form notifications](https://www.w3.org/WAI/tutorials/forms/notifications/), [WCAG status messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages), [NN/g machine-learning usability](https://www.nngroup.com/articles/machine-learning-ux/).

## Location context and neutral presentation - 17 October 2026

Optional city/region and country is validated (120-character maximum), sent only with an explicit AI request, and shown alongside the answered question. Instructions use details in the location field or description, adapt to stated constraints, ask when necessary and avoid treating US guidance as local evidence elsewhere. No geolocation or live service lookup was added. Provider/model branding was removed from privacy details, answers and saved-plan labels while retaining internal metadata compatibility. Shared section labels drive answer display and copy/save text.

88 automated tests pass, TypeScript and production build pass. New tests cover location validation, both provider contexts/instructions, location UI submission, absence of branding and shared formatting. Browser verified location context and section headings using deterministic safety output; narrow/desktop layouts inspected, with no horizontal overflow at 280-1440px. Live geographic relevance still requires configured credentials; automated tests do not establish model factual accuracy.
