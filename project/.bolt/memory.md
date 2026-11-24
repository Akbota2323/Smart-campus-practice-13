# Project memory

## Product intent & audience

- Room availability checker with an optional AI-generated explanation feature. Users check whether a room is free for a time slot and can request a natural-language explanation of the decision.
- Audience: developers/internal users interacting with a demo app that mocks an LLM explanation layer (no real API, no network).

## Brand personality & voice

- Explanations are clearly labeled as non-authoritative: card title is "AI-generated explanation — not a booking confirmation."
- Friendly, user-facing error wording ("could not be generated") rather than raw technical messages.

## Visual design & UX direction

- Existing UI design is fixed and must not be altered when adding features.
- New buttons reuse existing button styling (e.g., the Reset button style).
- The explain result is a separate card below the result banner; it includes a small source tag badge with variants for `mock`, `llm`, and `fallback`.
- The status badge is driven solely by `checkAvailability` output; explain must never override it.
- The explain card clears when room or time changes (same effect that clears prior results).

## Decisions, constraints & rationale

- `.bolt/prompt` is authoritative for framework, styling, icon, and import conventions.
- AGENTS.md exists as project instructions; references a branch-per-change workflow, but the project is not a git repo, so rollback relies on Version History.
- Do not modify `src/lib/availability.ts`, `src/lib/types.ts`, `src/lib/sampleData.ts`, or existing tests.
- Use the existing `src/lib/explainAvailability.ts` module as-is; do not rewrite it.
- No API keys, no network calls; use `mockAdapter` only.
- Explain flow: after a result is shown, render an optional "Explain availability" button. On click, call `buildExplainInput(room.name, start, end, decision)` then `explainAvailability(input)`.
- App must remember the exact time slot that was checked so the explain input uses the same times as the check.
- Validation gates: `npm run test`, `typecheck`, `lint`, `build` must all pass before proposing a diff; show a diff summary and await approval.
- Test coverage for the explain module includes: available, overlap, blocked, empty name, adapter error, timeout, contradicting output, and `buildExplainInput` dropping booking titles.

## Open questions & assumptions

- The exact `ExplainInput`/`ExplainResult` shapes are owned by `explainAvailability.ts`; tests and UI rely on its exported signatures.
- Approval flow expects a pause for user sign-off before proceeding after the diff summary.
- Branch workflow in AGENTS.md cannot be followed in a non-git environment; unclear if this should be addressed or ignored long-term.