# Before Waste

Before Waste helps people choose a practical next step before buying, replacing or
discarding an everyday item. It connects interactive object stories and everyday
choice scenarios with an AI assistant for questions about waste prevention and
sustainable living.

**Live app:** [before-waste.vercel.app](https://before-waste.vercel.app/)

## Who it helps

People making everyday decisions about things they own, especially when money,
tools or repair experience are limited. A student, renter or household member can
describe their situation in ordinary language and explore options that fit their
circumstances.

## What people can achieve

- Understand an object's lifecycle and compare choices before replacing or
  discarding it.
- Explore maintenance, repair and reuse options with guidance that takes account
  of the budget, skills, supplies and optional location they provide.
- Ask practical or conceptual questions about waste prevention and sustainable
  living, beyond the guided examples.
- Review, edit and save useful answers in their browser for later reference.
- Use the 7-Day Pause to reflect before a nonessential purchase.

The aim is to make thoughtful, lower-waste decisions easier to understand and put
into practice. The assistant offers a draft to review; people decide what fits
their situation. Local services are not checked live, and saved content stays in
the browser on that device.

## Built with

React, TypeScript, Vite and Tailwind CSS, with a server-side API for AI guidance.
The project was initially built in Google AI Studio. Development tools are
separate from the AI assistance people use in the app.

## Enable AI planning on Vercel

1. Deploy this branch including `api/plan.ts`. Vercel's Vite preset builds the
   frontend and discovers the Node.js API function. Use Node.js 24.
2. In Project Settings > Environment Variables, set `GEMINI_API_KEY` for Gemini
   and/or `AICREDITS_API_KEY` for AICredits. Select Production and, if needed,
   Preview. Never use a `VITE_` prefix for secrets.
3. Set `AI_PROVIDER=auto` for Gemini then AICredits, `aicredits` for AICredits
   only, or `gemini` for Gemini only. Default: auto. Optional model settings:
   `GEMINI_MODEL=gemini-3.8-flash` and
   `AICREDITS_MODEL=openai/gpt-4o-mini`. Choose an available text/chat model ID
   from your AICredits dashboard; the documented example is not a quality ranking.
4. Redeploy after setting variables. Vercel environment changes do not update an
   existing deployment. Keep default Vite settings: `npm run build`, output `dist`.
5. Open the deployed site without signing in. Ask a fictional question about food waste, reuse, repair or sustainable living, generate a plan, edit it, save it and reload. The accepted
   text should remain unchanged, with no second provider call.

No browser key entry is needed. Without a key, the server returns a clear setup
message and the existing basic guidance remains available. `npm run preview`
serves only the frontend; use `npm run dev` for local API testing.

The endpoint uses Google's Interactions REST API with structured output,
`store: false`, low thinking and a 4096-token cap. See the official
[Interactions guide](https://ai.google.dev/gemini-api/docs/interactions-overview)
and [structured-output guide](https://ai.google.dev/gemini-api/docs/structured-output).
Provider processing is still subject to Google's terms and your API tier.

AICredits uses `https://api.aicredits.in/v1/chat/completions` with its own Bearer
key, documented JSON-object mode and server-side schema validation. The API key
and model are read from `AICREDITS_API_KEY` and `AICREDITS_MODEL`. We do not send
the Gemini key to AICredits or the AICredits key to Google. See the
[AICredits API reference](https://aicredits.in/docs/api-reference).

In auto mode, providers without keys are skipped. Gemini failures (including quota,
timeout, invalid configuration and unusable output) trigger one AICredits attempt
when configured. A valid clarification or unsupported response is successful and
does not trigger fallback. With both configured, Gemini gets up to 8 seconds and
AICredits gets the remaining shared 20-second budget. Provider-only modes allow
20 seconds and never switch providers. If all configured providers fail, basic
non-AI guidance is shown. One visitor request can therefore incur charges from
both services. This is bounded failover, not repeated automatic retries.

The page uses provider-neutral AI disclosures, including possible backup processing. Internal provider/model metadata is retained for compatibility but is not displayed in answer or saved-plan labels. AICredits requests disable semantic caching via
`no_cache: true`; processing/retention by AICredits and its upstream model provider
remain subject to their policies. This is not a zero-retention guarantee.

## AI boundaries and deployment checks

- Descriptions, optional location and selected answers are sent only when AI guidance is requested. Saved
  reflection notes and saved-action notes are not sent. Original descriptions are
  not automatically persisted by this app; the reviewed plan is stored locally
  only when the visitor saves it.
- Suggestions are grounded in the editorial starting point and a vetted resource
  catalogue. The model returns resource IDs; code supplies the links. There is no
  live local-directory search, diagnosis, price quote or impact calculation.
- Ready plans can be edited and saved. Clarification/unsupported responses are not
  savable as action plans. Some explicit battery-risk descriptions use deterministic
  safety guidance labelled as not AI generated. Other risks still depend on model
  compliance and user review; this is not a certified repair or safety system.
- API requests have a shared 20-second upstream budget, payload/schema validation, same-
  origin browser checks and best-effort per-instance throttles (5 requests/client
  and 30 total per minute). The in-memory counters reset on cold starts and do not
  coordinate across instances. For public traffic, configure a Vercel Firewall
  rate-limit rule on `/api/plan` and provider spending/quota controls. The code
  throttle is not a global spending cap.
- Keys, prompts and provider error bodies are not logged by the application.
  Inspect platform/provider logging settings separately.
- Verify real model access, quota, latency and output quality after adding the
  keys. Automated tests simulate both services; they do not prove live model quality
  or that your AICredits wallet/model is accessible.

## Development

Use Node.js 24 and npm. The committed `package-lock.json` is the dependency source of truth.

```sh
npm ci
npm run dev
```

For local AI calls, copy `.env.example` to `.env.local`, fill in the provider keys
and restart the dev server. The Vite development middleware serves the same
`/api/plan` handler used on Vercel. Do not commit `.env.local`.

## Checks

```sh
npm run lint
npm test
npm run build
```

The component tests render the application in jsdom. They cover scenario keyboard
selection, dialog focus and background isolation, mobile Sources focus restoration,
story restart, reflection storage failures, AI plan editing and restoration,
stale-request cancellation, API validation, provider errors, quota and timeouts.
They do not verify live model quality or visual layout.
Before release, manually check narrow viewports, text zoom, and screen-reader behavior.

## Content

Environmental estimates depend on product, geography, and study assumptions. The
Sources dialog provides background references; the garment-care story also links
directly to WRAP's 2017 UK clothing-sector report. This is educational content, not
a product-specific footprint calculator or a comprehensive independent fact audit.

### Open questions
The default Ask freely mode requires no item selection. It accepts 10–1500 characters, including conceptual questions. The model receives only the description in this mode, without hidden budget or repair preferences. Guided examples still send selected constraints. Resource links come from a curated catalogue; if none is relevant, no link is fabricated. Answers are not live research or local collection verification. Unrelated requests should be redirected to the waste-prevention theme. When AI fails, clearly labelled general guidance is shown rather than a fabricated answer. Existing saved actions remain compatible.

### Location and answer presentation
Visitors can optionally provide city/region and country, or mention their location and other details in the question. No geolocation is requested or inferred. Both configured services receive the supplied context. Instructions require respecting stated budget, currency, housing, tools and access; ambiguous locations require clarification. Local rules and service availability are not live-verified. US references remain background outside the US. Answer display and copy/save formatting share section labels; provider/model names are not rendered on the page.

### Dedicated assistant page
The homepage keeps the stories and a compact question entry. `/ask` (and `/ask/`) renders the full assistant, location/context controls and existing saved action. Normal links support browser back/forward navigation. Vercel rewrites only these two paths to `index.html`; API routes remain untouched. A homepage question is carried through tab-scoped session storage, never URL parameters. It expires after 15 minutes and is consumed on arrival; no AI request is made until Get AI guidance is chosen. If session storage is blocked, the homepage keeps the text and offers manual copy/open recovery. Unsaved input is not a persistent chat history; save an accepted action to retain it across reloads. Follow-ups work by editing the current question with added details.
