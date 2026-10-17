# Before Waste

An everyday-object decision tool and interactive educational site built with React,
TypeScript, Vite and Tailwind CSS. An optional Gemini planner turns a visitor's
description and constraints into an editable action plan for clothes or headphones.

## Enable AI planning on Vercel

1. Deploy this branch including `api/plan.ts`. Vercel's Vite preset builds the
   frontend and discovers the Node.js API function. Use Node.js 24.
2. In Project Settings > Environment Variables, set `GEMINI_API_KEY` to a Gemini
   API key with access and quota for your chosen model. Select Production and,
   if needed, Preview. Never use a `VITE_` prefix for this secret.
3. Optionally set `GEMINI_MODEL=gemini-3.8-flash` (the default).
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
- API requests have a 20-second upstream timeout, payload/schema validation, same-
  origin browser checks and best-effort per-instance throttles (5 requests/client
  and 30 total per minute). The in-memory counters reset on cold starts and do not
  coordinate across instances. For public traffic, configure a Vercel Firewall
  rate-limit rule on `/api/plan` and provider spending/quota controls. The code
  throttle is not a global spending cap.
- Keys, prompts and provider error bodies are not logged by the application.
  Inspect platform/provider logging settings separately.
- Verify real model access, quota, latency and output quality after adding the
  key. Automated tests simulate Gemini; they do not prove live model quality.

## Development

Use Node.js 24 and npm. The committed `package-lock.json` is the dependency source of truth.

```sh
npm ci
npm run dev
```

For local AI calls, copy `.env.example` to `.env.local`, fill in `GEMINI_API_KEY`
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
