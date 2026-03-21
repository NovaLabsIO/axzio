# 4 Pillars Feature Request

Use this document to define the 4 Pillars module before implementation.

This document is for feature definition, not direct code changes.

Implementation work should still reference:
- `AGENTS.md` if present
- `docs/AXZIO_SYSTEM_V1.md`
- `docs/AXZIO_SESSION_START_PROMPT.md`
- `docs/axzio_cross_repo_inspection_order.md`
- `docs/AXZIO_IMPLEMENTATION_PROMPT_TEMPLATE.md`

---

## Feature Name

`4 Pillars`

---

## Feature Type

Choose one:
- new module
- UI enhancement
- flow extension
- result layer enhancement
- data / persistence enhancement
- architecture prep
- experimental / future-facing

Feature type:
`new module`

---

## Goal

State the core purpose of the feature in one clear sentence.

`Allow the user to assess and compare current vs target balance across Body, Mind, Heart, and Spirit, then receive actionable guidance on what to focus on next.`

---

## Why This Belongs In AXZIO

Explain why this feature fits the current AXZIO product rather than the broader future system only.

`This feature fits AXZIO as a natural expansion beyond the current v1 quiz/card flow. AXZIO v1 established a basic identity reading module. The 4 Pillars module extends AXZIO into a more interactive self-assessment system that can later inform richer guidance, reports, and AI.d recommendations.`

Use one of these labels:
- **Fits AXZIO v1 now**
- **Fits as a near-term extension**
- **Better as future architecture prep**
- **Conceptual only for now**

Label:
`Fits as a near-term extension`

---

## User Outcome

What should the user be able to understand, feel, or do after using this feature?

`The user should be able to quickly see where they currently feel balanced or imbalanced, compare that against a desired target state, and leave with a clearer sense of which pillar deserves attention right now and what next action would most improve alignment.`

---

## UX Summary

Describe the intended user experience in a few lines.

`The user enters a dedicated standalone 4 Pillars module after the existing AXZIO flow. The default view is Today. The user adjusts a current-state balance for Body, Mind, Heart, and Spirit using smooth sliders. The user can toggle to target-state editing in the same view and either use presets or customize target values. The chart makes the gap between current and target obvious. After setting values, the user requests guidance and receives a summary plus next-best-action recommendations, likely centered on the pillar that most needs focus.`

Include:
- where the feature lives
- how the user enters it
- what the main interaction is
- what they leave with

---

## Inputs

What data or interaction does the feature require?

Examples:
- manual slider input
- reflection answers
- derived signal values
- target-state values
- time range selection

Inputs:
- `timeframe selection: today | week | month | quarter | year`
- `manual current-state slider input for body, mind, heart, spirit`
- `manual target-state slider input for body, mind, heart, spirit`
- `target mode selection: restore | maintain | custom | growth`
- `future goal metadata per pillar, including a primary goal and three subgoals`
- `optional prior AXZIO module context in later versions`

---

## Outputs

What does the feature produce?

Outputs:
- `current vs target balance visualization across the four pillars`
- `stored pillar values for current and target states`
- `summary interpretation of imbalance and balance pattern`
- `recommended pillar to focus on next`
- `next-best-action guidance aligned to pillar state and target direction`
- `future report inputs for broader AXZIO card/report systems`

---

## Current Implementation Relationship

Describe how this feature relates to the current AXZIO codebase.

Use one:
- **extends existing v1 flow**
- **parallel module within v1**
- **requires new route/view**
- **requires new data model**
- **future-only, not for current v1**

Relationship:
`requires new route/view`
`requires new data model`
`parallel paid-version module in the same repo, separate from the current AXZIO v1 quiz/card flow`

Relevant current files:
- `docs/AXZIO_SYSTEM_V1.md`
- `src/routes/+page.svelte`
- `src/routes/reading/+page.svelte`
- `src/routes/reading/result/+page.svelte`
- `src/routes/api/analyze/+server.ts`
- `src/lib/identity/schema.ts`

---

## Conceptual Alignment

List any relevant `ne3ula-knowledge` concepts or docs.

Relevant concepts/docs:
- `AXZIO as the interface layer within the broader NE3ULA system`
- `identity-stack / decision-engine / alchemist-pyramid concepts as future guidance inputs`
- `pillar-based balance and self-assessment as a practical human-engine interface`
- `future AI.d interpretation and recommendation logic`

For each one, label it:
- **Implemented now**
- **Intended next**
- **Conceptual only**

Labels:
- `AXZIO as interface layer` — **Implemented now**
- `4 Pillars module as part of broader paid AXZIO app` — **Intended next**
- `AI.d-driven interpretation and more advanced decision logic` — **Conceptual only / Intended next depending on module phase**
- `Alchemy framing as internal inspiration only` — **Conceptual only**

---

## Acceptance Criteria

Define what must be true for the feature to be considered complete.

- `A standalone 4 Pillars module exists in the AXZIO repo as a route or clearly isolated module view.`
- `The module is visually mobile-first and consistent with AXZIO’s premium dark/refined design language.`
- `The user can select a timeframe, defaulting to Today.`
- `The user can adjust current-state pillar values for Body, Mind, Heart, and Spirit from the main view.`
- `The user can toggle into target-state editing from the same view.`
- `The user can choose a target mode: Restore Balance, Maintain Rhythm, Set Custom, Shift Toward Growth Goal.`
- `The visualization clearly shows the difference between current and target states for all four pillars.`
- `The module supports smooth slider interaction in the UI while storing normalized 1–10 values for logic use.`
- `Raw slider values are retained if this does not meaningfully complicate the initial implementation.`
- `Submitting the module produces a summary and a next-best-action recommendation.`
- `The output identifies either the most relevant pillar to focus on or a clear multi-pillar recommendation when appropriate.`
- `The feature remains separate from the current AXZIO v1 reading flow even if reachable after that flow.`

---

## Constraints

List hard constraints.

Examples:
- must remain mobile-first
- must fit AXZIO v1 styling language
- must avoid changing current identity reading flow
- must not require auth yet
- must not depend on unfinished ontology migration

Constraints:
- `must remain mobile-first`
- `must fit the current AXZIO visual language and feel native to the repo`
- `must not overwrite or destabilize the current AXZIO v1 quiz/card flow`
- `must live in the same repo for now`
- `must preserve the existing axzio-v1 branch as the stable v1 module branch`
- `must treat main as the broader evolving production branch for the paid app`
- `must not rely on Alchemy as visible UX copy or section naming at this stage`
- `must default to Today for v1 of this module`
- `week, month, quarter, and year modes may exist visually but their deeper review-session logic can be staged later`
- `goal editing per pillar can be scaffolded now but deeper goal-management flows may be phased`

---

## Do Not

List what should be avoided.

- `Do not frame the visible UX around “Alchemy” language for now.`
- `Do not collapse this module into the existing AXZIO v1 reading result page.`
- `Do not introduce unnecessary architecture or abstractions before repo-aware placement is confirmed.`
- `Do not assume future AI.d systems are already implemented.`
- `Do not force the user into a decorative or mystical UX that weakens clarity and usability.`
- `Do not overcomplicate initial value storage if normalized 1–10 logic is sufficient for the first build.`

---

## Delivery Recommendation

Choose one:
- implement now in AXZIO v1
- design as a staged extension
- create module shell only
- keep as concept until dependencies are ready

Recommendation:
`design as a staged extension`

Reason:
`The concept is clear enough to define and architect now, and it belongs in the same repo, but implementation should begin with repo-aware discovery, route placement, naming, and integration planning rather than immediate full build-out. The module is part of the broader paid AXZIO app, not a direct replacement for the current v1 flow.`

---

## Implementation Handoff Notes

Anything the implementation prompt should explicitly preserve or enforce.

`Before implementation, create and work from a new feature branch.`

`Implementation should begin with a repo-aware preflight step that inspects:`
- `docs/AXZIO_SYSTEM_V1.md`
- `docs/AXZIO_SESSION_START_PROMPT.md`
- `docs/axzio_cross_repo_inspection_order.md`
- current route/component structure
- current naming and architecture patterns
- any shared UI primitives already present in the AXZIO repo

`The first implementation prompt should ask where the module belongs architecturally before changing code.`

`The visible UX should use plain language such as 4 Pillars, current balance, target balance, and guidance / suggestions.`

`Target mode behavior should be designed as follows unless implementation review suggests a better fit:`
- `restore` = moves target toward a more even distribution
- `maintain` = keeps target close to current
- `custom` = allows direct user-set target editing
- `growth` = shifts target toward a more aspirational distribution aligned with goals

`Data model should likely include both raw UI values and normalized 1–10 values if this can be done without meaningful complexity.`

Suggested internal model:
- `timeframe: today | week | month | quarter | year`
- `targetMode: restore | maintain | custom | growth`
- `currentRaw: { body, mind, heart, spirit }`
- `targetRaw: { body, mind, heart, spirit }`
- `currentScore: { body, mind, heart, spirit } // normalized to 1–10`
- `targetScore: { body, mind, heart, spirit } // normalized to 1–10`

Future model extension:
- `goals: {`
  - `body: { primaryGoal, subGoals[] }`
  - `mind: { primaryGoal, subGoals[] }`
  - `heart: { primaryGoal, subGoals[] }`
  - `spirit: { primaryGoal, subGoals[] }`
- `}`

---

## Final Rule

Do not treat conceptual material from `ne3ula-knowledge` as implemented app behavior unless it is present in the current `axzio` repo.

Default principle:

**Current code first. Canonical AXZIO doc second. Conceptual knowledge repo third.**
