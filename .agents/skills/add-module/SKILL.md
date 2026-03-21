---
name: add-module
description: Add a new AXZIO module with minimal, production-safe changes that fit existing app structure.
---

## When to Use

- Creating a new route, component, or feature module inside the AXZIO app.
- Extending the app with functionality that should follow current patterns and naming.

## What to Inspect First

- `AGENTS.md`
- Existing files near the target feature area
- `package.json`
- Current route and component structure under `src/`

## Acceptance Criteria

- The module fits existing AXZIO conventions and architecture.
- Changes are minimal and do not introduce unnecessary dependencies.
- New code is wired into the app only where required.
- The implementation is safe to ship as a starter baseline.
