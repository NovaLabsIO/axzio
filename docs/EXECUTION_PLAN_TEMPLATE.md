# AXZIO Execution Plan Template

Use this template for non-trivial Codex work in this repository.

Before implementation:

- Confirm the current branch and working tree state.
- Read `AGENTS.md` first.
- Read `docs/AXZIO_SYSTEM_V1.md` before implementation.
- Inspect the relevant feature-area files and current git diff/status.
- Prefer existing patterns over invention.
- Keep diffs minimal.
- Verify results before finishing.

## Task

Briefly state the requested change.

## Goal / Definition of Done

- Describe the intended end state.
- List the specific user-visible or implementation outcomes that must be true when complete.

## Files to Inspect First

- `AGENTS.md`
- `docs/AXZIO_SYSTEM_V1.md`
- Relevant route, component, config, and server files for the feature area
- Any nearby tests, schemas, or supporting docs already used by the implementation

## Constraints

- Preserve AXZIO v1 architecture and naming conventions.
- Reuse existing patterns before adding new structures.
- Avoid unnecessary dependencies or major architectural changes.
- Keep the implementation production-safe and mobile-first where UI is involved.
- Do not modify canonical docs unless the task explicitly requires it.

## Proposed Changes

- Summarize the planned edits before making them.
- Note which files are expected to change and why.
- Call out any assumptions that affect implementation.

## Validation Steps

- Confirm the current branch and working tree state.
- Record what was validated directly and what remains unverified. 
- Run the most relevant local checks for the changed area.
- Verify the affected flow or behavior directly.
- Confirm the diff stays focused on the requested task.

## Risks / Follow-ups

- Note any meaningful risks, edge cases, or verification gaps.
- List any follow-up work only if it is clearly outside the current task.
