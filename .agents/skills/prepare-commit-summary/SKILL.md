---
name: prepare-commit-summary
description: Prepare a concise commit summary that accurately reflects AXZIO changes and their user-facing impact.
---

## When to Use

- Finalizing a set of changes for commit.
- Writing a clear summary after implementation or review work.

## What to Inspect First

- `AGENTS.md`
- Current git diff and staged status
- The primary files changed for the task

## Acceptance Criteria

- The summary matches the actual diff without overstating scope.
- User-facing and architectural impacts are described succinctly.
- Risky or follow-up items are noted when relevant.
- The result is concise and suitable for a commit or handoff note.
