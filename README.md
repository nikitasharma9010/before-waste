# Before Waste

Earth's resources are finite, and everyday objects depend on materials, water,
energy and human effort. How we buy, use and care for these objects affects what
remains for future generations.

Before Waste helps people understand these connections and explore practical
options that fit their circumstances, without expecting them to change everything
at once.

**Live app:** [before-waste.vercel.app](https://before-waste.vercel.app/)

## Feedback

Feedback and suggestions are welcome.
[Share feedback](https://docs.google.com/forms/d/e/1FAIpQLSfuQbhpDFuQXq2N9SQue6fF-coyQaDuZ9K6UDpj_X4Rh3Y2OA/viewform)

## The problem

Waste is often treated as a disposal problem, after decisions about buying,
using and replacing things have already been made. That view can hide the
materials, water, energy and human effort behind an object and the opportunities
to prevent waste earlier. People may understand why waste prevention matters but still be unsure what
options fit their everyday circumstances.

Product design, affordable alternatives and local services also shape what is
possible. The responsibility does not sit with individuals alone.

## Who it helps

Before Waste is for everyday consumers, especially students, young adults and
households deciding what to buy, how to use what they have and what happens when
they no longer need an item. The experience respects differences in budget,
skills, available time and access to alternatives, without expecting perfect choices.

## From awareness to action

- **Understand:** follow familiar objects from natural resources and human work
  through daily use and their next possible chapter.
- **Reflect:** compare everyday choices, explore resource demand and supportive
  systems, and use the written 7-Day Pause prompts before nonessential purchases.
- **Apply:** ask practical or conceptual questions about waste prevention and
  sustainable living. Guidance considers the context a visitor chooses to give.
- **Choose and keep:** review, edit and save useful answers in the browser.

The stories, scenarios and pause prompts work without AI generation. AI supports
questions that need explanation or guidance for a particular situation.

Repair is one example within this wider journey. The aim is to help people avoid
unnecessary purchases, consider borrowing or reuse, care for what they have and
keep useful things in use longer. These choices may help avoid unnecessary spending and waste
while supporting more thoughtful use of Earth's resources and care for those
who come after us.

The assistant offers options and a draft to review, not a final decision.
People decide what is appropriate for their own circumstances.
Local services are not checked live, and saved content stays in the browser on
that device. The app does not calculate environmental savings.

## Background references

These sources explain the resource-use and waste-prevention principles behind
the project; they do not evaluate this MVP or establish its impact.

- [MoEFCC: Mission LiFE sustainable lifestyle actions](https://missionlife-moefcc.nic.in/assets/pdf/ML%20Brochure_English_V5.pdf) - mindful resource use through individual and collective action.
- [UNEP International Resource Panel: Global Resources Outlook 2024](https://www.unep.org/resources/Global-Resource-Outlook-2024)
- [Ellen MacArthur Foundation: Circular economy overview](https://www.ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview)

## Built with

React, TypeScript, Vite and Tailwind CSS, with a server-side API for AI guidance.
The project was initially built in Google AI Studio. Development tools are
separate from the AI assistance people use in the app.

## Enable AI planning on Vercel

1. Deploy this branch including `api/plan.ts`. Vercel's Vite preset builds the
   frontend and discovers the Node.js API function. Use Node.js 24.
2. In Project Settings > Environment Variables, set `AICREDITS_API_KEY` for
   Production and, if needed, Preview. Never use a `VITE_` prefix for secrets.
3. Optionally set `AICREDITS_MODEL` (default: `openai/gpt-4o-mini`) to an available
   text/chat model ID in your dashboard. Gemini is no longer called. Legacy
   `AI_PROVIDER`, `GEMINI_API_KEY` and `GEMINI_MODEL` settings are ignored and may be deleted.
4. Redeploy after setting variables. Vercel environment changes do not update an
   existing deployment. Keep default Vite settings: `npm run build`, output `dist`.
5. Open the deployed site without signing in. Ask a fictional question about food waste, reuse, repair or sustainable living, generate a plan, edit it, save it and reload. The accepted
   text should remain unchanged, with no second provider call.

No browser key entry is needed. Without a key, the server returns a clear setup
message and the existing basic guidance remains available. `npm run preview`
serves only the frontend; use `npm run dev` for local API testing.

The server calls only `https://api.aicredits.in/v1/chat/completions`, using a
server-side Bearer key, JSON-object mode, a 4096-token cap and schema validation.
See the [AICredits API reference](https://aicredits.in/docs/api-reference).
An explicit upstream 503 gets one retry after 500 ms when enough of the shared
20-second budget remains. Authentication, credits, quota, invalid-output and
ambiguous timeout failures are not retried. There are at most two upstream
attempts per visitor request; persistent outages can still prevent generation.

Provider/model metadata is retained internally for compatibility and is not shown
in answer or saved-plan labels. Requests disable semantic caching via
`no_cache: true`; processing/retention by AICredits and its upstream model provider
remain subject to their policies. This is not a zero-retention guarantee.

## AI boundaries and deployment checks

- Descriptions, optional location and selected answers are sent only when AI guidance is requested. Saved
  reflection notes and saved-action notes are not sent. Original descriptions are
  not automatically persisted by this app; the accepted answer and its original
  question are stored locally when the visitor explicitly saves them.
- Suggestions are grounded in the editorial starting point and a vetted resource
  catalogue. The model returns resource IDs; code supplies the links. Response-format checks
  do not verify the factual accuracy of every claim. There is no
  live local-directory search, diagnosis, price quote or impact calculation.
- Ready plans can be edited and saved. Clarification and unsupported responses are not
  savable as action plans. Some explicit battery-risk descriptions use deterministic
  safety guidance labelled as not AI generated. Other risks still depend on model
  compliance and user review; this is not a certified repair or safety system.
- API requests have a shared 20-second upstream budget, payload/schema validation, same-origin
  browser checks and best-effort per-instance throttles (5 requests/client
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
Before release, manually check narrow viewports, text zoom and screen-reader behaviour.

## Content

Environmental estimates depend on product, geography and study assumptions. The
Sources dialog provides background references; the garment-care story also links
directly to WRAP's 2017 UK clothing-sector report. This is educational content, not
a product-specific footprint calculator or a comprehensive independent fact audit.

### Open questions
The default Ask freely mode requires no item selection. It accepts 10–1500 characters, including conceptual questions. The model receives the question and any supplied location context in this mode, without hidden budget or repair preferences. Guided examples still send selected constraints. Resource links come from a curated catalogue; if none is relevant, no link is fabricated. Answers are not live research or local collection verification. Unrelated requests should be redirected to the waste-prevention theme. When AI fails, clearly labelled general guidance is shown rather than a fabricated answer. Existing saved actions remain compatible.

### Location and answer presentation
Visitors can optionally provide city/region and country, or mention their location and other details in the question. No geolocation is requested or inferred. The configured service handling a request receives the supplied context; AICredits and its upstream model provider process this context. Instructions require respecting stated budget, currency, housing, tools and access; ambiguous locations require clarification. Local rules and service availability are not live-verified. US references remain background outside the US. Answer display and copy/save formatting share section labels; provider/model names are not rendered on the page.

### Dedicated assistant page
The homepage keeps the stories and a compact question entry. `/ask` (and `/ask/`) renders the full assistant, location/context controls and separate Ask and Saved tabs for multiple answers. Normal links support browser back/forward navigation. Vercel rewrites only these two paths to `index.html`; API routes remain untouched. A homepage question is carried through tab-scoped session storage, never URL parameters. It expires after 15 minutes and is consumed on arrival; no AI request is made until Get AI guidance is chosen. If session storage is blocked, the homepage keeps the text and offers manual copy/open recovery. Unsaved input is not a persistent chat history; save an accepted action to retain it across reloads. Follow-ups work by editing the current question with added details.
