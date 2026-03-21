# AXZIO Feature Request Template

Use this template to define a new AXZIO feature before implementation.

This document is for feature definition, not direct code changes.

Implementation work should still reference:
- `AGENTS.md` if present
- `docs/AXZIO_SYSTEM_V1.md`
- `docs/AXZIO_SESSION_START_PROMPT.md`
- `docs/axzio_cross_repo_inspection_order.md`
- `docs/AXZIO_IMPLEMENTATION_PROMPT_TEMPLATE.md`

---

## Feature Name

`[INSERT FEATURE NAME]`

Example:
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
`[INSERT FEATURE TYPE]`

---

## Goal

State the core purpose of the feature in one clear sentence.

`[INSERT GOAL]`

Example:
Help users assess their current balance across Body, Mind, Heart, and Spirit, compare it to a target state, and identify where adjustment is needed.

---

## Why This Belongs In AXZIO

Explain why this feature fits the current AXZIO product rather than the broader future system only.

`[INSERT RATIONALE]`

Use one of these labels:
- **Fits AXZIO v1 now**
- **Fits as a near-term extension**
- **Better as future architecture prep**
- **Conceptual only for now**

Label:
`[INSERT LABEL]`

---

## User Outcome

What should the user be able to understand, feel, or do after using this feature?

`[INSERT USER OUTCOME]`

---

## UX Summary

Describe the intended user experience in a few lines.

`[INSERT UX SUMMARY]`

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
- `[INSERT INPUT]`
- `[INSERT INPUT]`
- `[INSERT INPUT]`

---

## Outputs

What does the feature produce?

Examples:
- visualization
- summary insight
- recommended next move
- stored state
- comparison view

Outputs:
- `[INSERT OUTPUT]`
- `[INSERT OUTPUT]`
- `[INSERT OUTPUT]`

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
`[INSERT RELATIONSHIP]`

Relevant current files:
- `[INSERT FILE]`
- `[INSERT FILE]`
- `[INSERT FILE]`

---

## Conceptual Alignment

List any relevant `ne3ula-knowledge` concepts or docs.

Relevant concepts/docs:
- `[INSERT DOC OR CONCEPT]`
- `[INSERT DOC OR CONCEPT]`

For each one, label it:
- **Implemented now**
- **Intended next**
- **Conceptual only**

---

## Acceptance Criteria

Define what must be true for the feature to be considered complete.

- `[INSERT ACCEPTANCE CRITERION]`
- `[INSERT ACCEPTANCE CRITERION]`
- `[INSERT ACCEPTANCE CRITERION]`
- `[INSERT ACCEPTANCE CRITERION]`

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
- `[INSERT CONSTRAINT]`
- `[INSERT CONSTRAINT]`
- `[INSERT CONSTRAINT]`

---

## Do Not

List what should be avoided.

- `[INSERT THING TO AVOID]`
- `[INSERT THING TO AVOID]`
- `[INSERT THING TO AVOID]`

---

## Delivery Recommendation

Choose one:
- implement now in AXZIO v1
- design as a staged extension
- create module shell only
- keep as concept until dependencies are ready

Recommendation:
`[INSERT RECOMMENDATION]`

Reason:
`[INSERT REASON]`

---

## Implementation Handoff Notes

Anything the implementation prompt should explicitly preserve or enforce.

`[INSERT HANDOFF NOTES]`

---

## Final Rule

Do not treat conceptual material from `ne3ula-knowledge` as implemented app behavior unless it is present in the current `axzio` repo.

Default principle:

**Current code first. Canonical AXZIO doc second. Conceptual knowledge repo third.**
