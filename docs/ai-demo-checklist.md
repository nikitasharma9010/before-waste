# AI planner: deployment and demo checks

## Configuration

Set `GEMINI_API_KEY` in Vercel's project environment variables for the deployment
environment you will demonstrate. Optional: `GEMINI_MODEL=gemini-3.8-flash`.
Redeploy after changing environment variables. Keep the key out of source control,
browser code and the recording. Confirm model access and quota in Google AI Studio.

The API is `POST /api/plan`; the Vite local dev server serves the same handler.
`npm run preview` is frontend-only. See README.md for operation and limits.

## Fictional examples

Choose the matching item/intention/help/budget options before generating. The
description can include what was tried, exact budget limits and urgency.

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
5. Unsupported scope: describe a refrigerator while headphones is selected. The
   result should stay within supported scope or ask a clarification, without
   generating appliance-repair instructions.
6. Safety: "My headphones have a swollen battery and no longer work." This
   triggers explicitly labelled deterministic safety guidance, not an AI result.

## End-to-end checks after the key is configured

- Open the public URL without signing in and on a physical phone.
- Generate a real AI plan using fictional inputs; check the AI-generated label and
  configured model name. No static/safety fallback should be represented as AI.
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
