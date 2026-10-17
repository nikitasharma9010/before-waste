# AI planner: deployment and demo checks

## Configuration

Set `GEMINI_API_KEY` in Vercel's project environment variables for the deployment
environment you will demonstrate. Optional: `GEMINI_MODEL=gemini-3.8-flash`.
For AICredits fallback, set `AICREDITS_API_KEY` and `AICREDITS_MODEL` to an available
chat model ID, and keep `AI_PROVIDER=auto`. Set `AI_PROVIDER=aicredits` to use that
wallet directly without trying Gemini. Redeploy after changes. In a test deployment,
use a deliberately invalid Gemini test key with a valid AICredits key to check the
fallback, then restore the intended configuration. Do not expose keys in recordings.
Redeploy after changing environment variables. Keep the key out of source control,
browser code and the recording. Confirm model access and quota in Google AI Studio.

The API is `POST /api/plan`; the Vite local dev server serves the same handler.
`npm run preview` is frontend-only. See README.md for operation and limits.

## Fictional examples

Start in Ask freely for any theme-related question. For examples 1–4, select Use guided examples and choose the matching item/intention/help/budget options. The description can include what was tried, exact budget limits and urgency.

1. Clothes / needs attention / missing button / myself / no spending:
   "My coat button is loose. I have the spare button and thread but no needle.
   I need the coat next week and want to start without spending."
2. Headphones / needs attention / no sound / find help / consider a cost:
   "Only the left side of my wired headphones plays. I already tried another
   compatible device. I have no tools, a budget of at most ₹300 and need audio
   tomorrow."
3. Clothes / no longer needed:
   "I have two clean cotton shirts that fit poorly but are still wearable. I can
   hand them over nearby but cannot pay for a courier. What can I try first?"
4. Clarification: "My headphones make an odd sound. I do not know the model or
   whether the problem is with my phone. What information should I check?"
5. Open questions: try "How can I waste less food?", "Can I reuse takeaway containers?", "What can I do with a broken chair?", and "What is a circular economy?". No item selection should be required. Check that conceptual answers explain the idea directly and no hidden budget constraint is assumed. Try an unrelated request, which should be redirected to the theme. For safety-critical or local questions, check that the model asks for needed details and avoids inventing rules.
6. Safety: "My headphones have a swollen battery and no longer work." This
   triggers explicitly labelled deterministic safety guidance, not an AI result.

## End-to-end checks after the key is configured

- Open the public URL without signing in and on a physical phone.
- Generate a real AI plan using fictional inputs; check the AI-generated label and
  AI-assistance disclosure without provider/model branding. Verify both configured services use the same answer layout.
  No static/safety fallback should be represented as AI.
- Confirm it respects budget, help and urgency and does not repeat a failed check.
- Confirm links come from the resource catalogue, with local/US scope disclosed.
- Change a constraint and regenerate. Check whether the advice changes usefully.
- Edit the accepted plan, save, reload and verify exact text restoration.
- Copy the saved plan. Check notes/outcomes and replacement Undo still work.
- Clarification/unsupported output must not offer a save-as-action button.
- During a pending request change a selection or edit the description. A cancelled
  old response must not overwrite the current state.
- Exercise a provider error/quota failure in a test environment. Basic guidance
  should be explicitly labelled as not AI generated.

## Verification limits

The automated tests simulate provider responses. No real model key was supplied
for this implementation, so output quality, account/model access and deployment
quota must be checked after configuration. Browser checks exercised unavailable-
provider fallback, the deterministic safety path, editing, saving and restoration.
Layout checks at 280, 320, 375, 768, 1280 and 1440px found no page overflow.

The prompt and resource restrictions reduce some risks; they are not a guarantee
of factual or repair safety. Judge outputs on actual scenarios. Do not claim a
diagnosis, verified local service, measured environmental savings or an evaluated
model-quality advantage without evidence.

## AI assistance interaction checks

- Choose a starter question: it should fill and focus the input without sending anything.
- Submit fewer than 10 characters: the error should be linked to the focused field.
- Enter should add a newline. Ctrl/Cmd+Enter should request AI guidance, never trigger basic guidance.
- During a request, cancel it; the question must remain and late results must be ignored.
- Edit a reviewed draft, then change the question and force a failed request: the edited draft must remain.
- Check the original question above each answer. Edit my question or Add details to my question should return focus to the input without erasing it.
- Expand Edit the draft before saving to change the text. Copy a draft before saving; confirm it copies the edited version. Empty text should explain why saving is disabled.
- Check the live status announcements using a screen reader and try the flow on a physical phone, including with the keyboard open.

## Location and consistent answers

- Try Pune, India with INR 200, a small flat and no tools; then another city/country and currency. Confirm suggestions respect the supplied details without inventing prices, businesses or local collection rules.
- Also put location only in the question. Do not require the separate field or ask again for already-supplied details.
- Try conflicting locations and a local collection question without location: ask for clarification when needed. General educational questions should work without location.
- Check current answers, expanded privacy details and older saved plans: no provider/model branding should appear. AI assistance and external processing remain disclosed.
- Display and copied drafts should use the same reason, steps, alternative and resource labels. User-edited saved text remains as edited.

## Dedicated assistant navigation

- From the homepage, enter a fictional question and Continue to assistant. Confirm it appears at `/ask` without the question in the URL and without an automatic AI request.
- Open `/ask` directly and refresh `/ask` and `/ask/` on the deployed Vercel preview. Confirm `/api/plan` still returns API JSON rather than the SPA HTML.
- Check browser Back/Forward, home/story links, mobile navigation, sources dialog and saved action after changing pages.
- Use an unrelated-location/repair example, edit with clarification details and regenerate. Context is the visible question/selected details, not an automatic hidden chat history.
- If tab storage is blocked, the homepage must preserve the question and offer a manual recovery link.

## Diagnose generation failures when credits remain

Credits alone do not establish that the configured API key and model can generate. AICredits documents a per-API-key wallet balance at GET /v1/credits; its endpoint is https://api.aicredits.in/v1/chat/completions (https://aicredits.in/docs/api-reference). Never paste keys into logs or a public issue.

After deploying, inspect the Vercel function logs for `beforewaste.planner.failure` or `beforewaste.planner.upstream`. These events contain provider name, a fixed diagnostic code and HTTP status only—not questions, keys, responses or headers.

- AI_NOT_CONFIGURED / AI_CONFIGURATION: check environment names, target environment and redeploy.
- AI_ACCESS: upstream 401/403. Check key validity and permissions.
- AI_CREDITS: upstream 402. Check the wallet and API-key account used by this deployment.
- AI_MODEL_OR_ENDPOINT: upstream 404. Check the configured model ID and provider availability.
- AI_REQUEST_REJECTED: upstream 400. Check provider capability/request compatibility.
- AI_RATE_LIMIT: upstream 429. Quota/rate limiting can occur even with credits.
- AI_TIMEOUT / AI_NETWORK / AI_UPSTREAM: transient connectivity, deadline or service failure.
- AI_INVALID_RESPONSE / AI_OUTPUT_POLICY: a response arrived but failed the app contract or policy. Credits do not bypass validation.

The API error JSON includes the provider-neutral diagnostic code. Raw upstream error messages are deliberately not returned. AI_PROVIDER=gemini disables AICredits fallback; use auto to enable both configured services or aicredits to isolate that service. Environment changes need a new production deployment. Run the synthetic evaluation command in ai-evaluation.md against each configured service before changing model defaults.
