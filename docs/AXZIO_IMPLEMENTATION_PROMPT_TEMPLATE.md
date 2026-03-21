# AXZIO Implementation Prompt Template

Use this template when requesting implementation work for AXZIO.

---

You are working inside the existing AXZIO codebase.

Before making any changes, read and follow:

- `AGENTS.md` if present
- `docs/AXZIO_SYSTEM_V1.md`
- `docs/AXZIO_SESSION_START_PROMPT.md`
- `docs/axzio_cross_repo_inspection_order.md`

Also inspect the relevant implementation files before proposing changes.

If conceptual guidance is needed, inspect the relevant documents in `ne3ula-knowledge` only after grounding in current AXZIO implementation.

## Source-of-truth rules

Treat:
- `axzio` as implementation truth
- `ne3ula-knowledge` as conceptual / ontology guidance

If there is a mismatch:
- current `axzio` code wins for statements about live app behavior
- `docs/AXZIO_SYSTEM_V1.md` is the canonical app doc unless code proves otherwise
- conceptual repo material must be labeled explicitly as intended or conceptual if not yet implemented

Do not silently blend implemented behavior and intended future design.

---

## Task Type

Classify this request as one of:
- bug fix / implementation correction
- AXZIO v1 extension
- future-facing architecture prep
- conceptual alignment only

Task type for this request:
`[INSERT TASK TYPE]`

---

## Mission

`[INSERT CLEAR TASK GOAL]`

Examples:
- Implement a new 4 Pillars module inside the existing AXZIO v1 app
- Refine the landing page CTA layout without changing the current app structure
- Add a new result card section using existing styling conventions
- Prepare a future-safe module shell without changing current production flow

---

## Constraints

Follow these constraints unless the task explicitly overrides them:

- make minimal, production-safe changes
- preserve existing AXZIO patterns and file structure
- avoid unnecessary refactors
- do not invent architecture that is not justified by current code
- keep vocabulary aligned with the current implemented AXZIO system unless the task explicitly calls for a terminology update
- if introducing future-facing structure, separate it clearly from current v1 behavior

Project-specific constraints:
- `[INSERT CONSTRAINT]`
- `[INSERT CONSTRAINT]`
- `[INSERT CONSTRAINT]`

---

## Files To Inspect First

List the files that are most relevant before implementation.

Examples:
- `src/routes/+page.svelte`
- `src/routes/reading/+page.svelte`
- `src/routes/reading/result/+page.svelte`
- `src/routes/api/analyze/+server.ts`
- `src/lib/identity/schema.ts`
- `src/lib/config/modes.ts`

Files for this task:
- `[INSERT FILE]`
- `[INSERT FILE]`
- `[INSERT FILE]`

---

## Conceptual Alignment Inputs

Only include these if needed.

Relevant `ne3ula-knowledge` docs:
- `[INSERT DOC]`
- `[INSERT DOC]`

For each concept taken from the knowledge repo, label it as:
- Implemented now
- Intended next
- Conceptual only

---

## Required Output Format

Respond in this order:

### 1) Current implementation reality
- summarize the current relevant code state
- identify constraints from actual implementation
- note any branch-specific considerations if applicable

### 2) Conceptual alignment
- summarize relevant ontology / knowledge-repo alignment
- explicitly label implemented vs intended vs conceptual

### 3) Proposed implementation plan
- describe the minimal viable implementation path
- explain how it fits existing AXZIO patterns

### 4) Tool-by-tool execution steps
For each step, specify:
- **Codex in VS Code** for multi-file code edits and implementation
- **Terminal** for branch creation, install, local dev, tests, builds, commit, push
- **GitHub** for diff review, branch comparison, PR inspection, verification

### 5) Deliverable
Provide one of the following depending on the request:
- a Codex-ready implementation prompt
- a step-by-step implementation plan
- a patch / file-level change plan
- a review of whether the requested feature fits current AXZIO architecture

---

## Optional Feature-Specific Section

Use this section when building a new module or UI feature.

### UX Goal
`[INSERT UX GOAL]`

### User Outcome
`[INSERT USER OUTCOME]`

### Acceptance Criteria
- `[INSERT ACCEPTANCE CRITERION]`
- `[INSERT ACCEPTANCE CRITERION]`
- `[INSERT ACCEPTANCE CRITERION]`

### Do Not
- `[INSERT THING TO AVOID]`
- `[INSERT THING TO AVOID]`

---

## Final Rule

Default principle:

**Current code first. Canonical AXZIO doc second. Conceptual knowledge repo third.**
