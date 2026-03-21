---
name: review-axzio-ui
description: Review AXZIO interface changes for clarity, regressions, responsiveness, and alignment with v1 product goals.
---

## When to Use

- Reviewing UI work before merge or release.
- Checking whether a change preserves the AXZIO v1 flow and mobile-first behavior.

## What to Inspect First

- `AGENTS.md`
- Relevant route and component files in `src/`
- Any local styles or layout files affected by the change
- Current git diff for the UI change under review

## Acceptance Criteria

- The UI remains clear, mobile-first, and consistent with existing patterns.
- No obvious regressions are introduced in the landing, question, analysis, or result flow.
- Review feedback is specific, actionable, and tied to the changed files.
- Risks and missing checks are called out when verification is incomplete.
