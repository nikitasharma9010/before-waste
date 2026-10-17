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
   compatible device. I have no tools, a budget of at most â‚¹300 and need audio
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
  gateway/model name. Verify AICredits is shown when that service handles the call.
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
