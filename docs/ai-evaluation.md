# Evaluating Before Waste AI guidance

Run deterministic regression tests with `npm test`. They use mocked provider responses and test routing, field contracts, policy rejection, failover and conversation context. They do not establish live model compliance.

Preview synthetic evaluation cases without keys, network calls or credits:

    npm run eval:ai -- --dry-run

For a live run, set the selected server-side API key and optional model override in your shell environment. Do not commit keys or prefix them with VITE_. These commands make external AI calls and spend provider credits:

    npm run eval:ai -- --provider=gemini
    npm run eval:ai -- --provider=aicredits

The runner forces the selected provider, disabling cross-provider failover for a fair comparison. It uses the same generatePlan path as the API, including local safety routing, output validation and request deadlines. It prints accepted responses and basic checks for nine synthetic cases. A rejected response or network/configuration failure fails the run. No user conversations or saved notes are loaded. Run before changing a provider/model default or materially changing the prompt.

Human review remains required: assess every output field for safe advice, unsupported factual claims, sensible location handling, no-cost constraints, language quality, and refusal quality. A recognised resource is a reading suggestion, not evidence of every claim. A single numbered step may hide multiple tasks; check this manually. Repeat cases across runs to assess variability; one passing sample does not certify behaviour.

Known limits: the local battery classifier and prohibited-output checks cover targeted English patterns, not every hazard, wording or language. Unrecognised cases still depend on the model. The editable conversation background retains the first question and manual edits, not automatically inferred facts; users must update it when important details change. It and recent turns clear on reload/new conversation and are never restored from saved notes.
