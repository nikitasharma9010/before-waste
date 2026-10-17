# Before Waste

An everyday-object decision tool and interactive educational site built with React,
TypeScript, Vite and Tailwind CSS. An optional AI planner turns a visitor's
description and constraints into an editable action plan for clothes or headphones.

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
5. Open the deployed site without signing in. Describe a fictional clothes or
   headphones situation, generate a plan, edit it, save it and reload. The accepted
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

The page discloses potential transfer to both services, and saved plans retain the
gateway/model provenance. AICredits requests disable semantic caching via
`no_cache: true`; processing/retention by AICredits and its upstream model provider
remain subject to their policies. This is not a zero-retention guarantee.

## AI boundaries and deployment checks

- Descriptions and selected answers are sent only when Generate is clicked. Saved
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
