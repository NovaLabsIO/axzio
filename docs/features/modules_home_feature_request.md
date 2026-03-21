# Modules Home Feature Request

Use this document to define the future AXZIO modules home before implementation.

This document is for feature definition, not direct code changes.

Implementation work should still reference:
- `AGENTS.md` if present
- `docs/AXZIO_SYSTEM_V1.md`
- `docs/AXZIO_SESSION_START_PROMPT.md`
- `docs/axzio_cross_repo_inspection_order.md`
- `docs/AXZIO_IMPLEMENTATION_PROMPT_TEMPLATE.md`

---

## Feature Name

`Modules Home`

---

## Feature Type

Feature type:
`new module`
`navigation layer`
`future-facing app structure`

---

## Goal

`Provide a single AXZIO-native home screen that acts as the entry point to the different modules of the broader paid app, such as the v1 quiz, 4 Pillars, Paths / Pyramid, and future modules.`

---

## Why This Belongs In AXZIO

`AXZIO is evolving from a single quiz/result experience into a broader modular system. A Modules Home creates the correct navigation layer for that expansion and prevents individual modules from being awkwardly linked from unrelated surfaces. It gives the paid-version app a clearer structure while preserving the existing v1 flow as one module among several.`

Label:
`Fits as a near-term extension`

---

## User Outcome

`The user should be able to land on a single page, understand what modules are available, what each one is for, and choose the experience that best fits what they want to do right now.`

---

## UX Summary

`The user enters a central AXZIO modules page that presents available modules as clearly separated cards or tiles. Each module has a name, a short purpose statement, and a CTA such as Open, Continue, or Coming Soon. The page should feel like the beginning of the broader AXZIO app rather than an add-on to the current v1 quiz. It should support current live modules first and allow future modules to be represented cleanly even before they are fully built.`

---

## Initial Module Set

Initial modules the home should eventually support:
- `AXZIO ID` — the current v1 quiz / reading flow
- `4 Pillars` — current vs target balance across Body, Mind, Heart, Spirit
- `Paths / Pyramid` — future module
- `Additional future modules` — placeholder support

---

## Inputs

Inputs:
- `module registry or static module definitions`
- `module route paths`
- `module status: live | in progress | coming soon`
- `optional short descriptions and CTA labels`

---

## Outputs

Outputs:
- `a central module-selection screen`
- `clear navigation into each module`
- `future-ready structure for representing more modules`
- `an app-level entry point for the broader paid AXZIO experience`

---

## Current Implementation Relationship

Relationship:
`requires new route/view`
`requires app-level navigation structure`
`should not replace the current AXZIO v1 flow immediately`

Relevant current files:
- `docs/AXZIO_SYSTEM_V1.md`
- `src/routes/+page.svelte`
- `src/routes/reading/+page.svelte`
- `src/routes/reading/result/+page.svelte`
- `src/routes/pillars/+page.svelte`

---

## Conceptual Alignment

Relevant concepts/docs:
- `AXZIO as the interface/navigation layer`
- `module-based evolution from a single quiz into a broader paid app`
- `future integration of multiple self-assessment and guidance systems`

Labels:
- `current v1 reading flow` — **Implemented now**
- `4 Pillars module` — **Implemented now / Intended next depending on branch state**
- `Modules Home as central app navigation` — **Intended next**
- `broader modular AXZIO system` — **Conceptual only / Intended next**

---

## Acceptance Criteria

- `A future Modules Home route is clearly defined in the repo documentation.`
- `The home is positioned as the app-level navigation layer for the broader paid AXZIO experience.`
- `It supports at least the current v1 reading flow and 4 Pillars as separate modules.`
- `It allows future modules to appear as placeholders without requiring full implementation.`
- `It does not force an immediate redesign of existing module screens.`
- `It avoids collapsing all functionality back into the current landing page.`
- `It can later become the correct entry point for authenticated or paid users.`

---

## Constraints

Constraints:
- `must fit AXZIO’s current visual language when implemented`
- `must not destabilize the existing v1 route flow`
- `must not force a navigation decision until broader app routing is ready`
- `must support future modules cleanly`
- `should be lightweight and structurally clear`
- `should not require auth in the first implementation unless broader app architecture demands it`

---

## Do Not

- `Do not add a temporary direct CTA from the current v1 flow just to compensate for the missing hub.`
- `Do not redesign existing modules solely to fit the home before the module set matures.`
- `Do not treat the current v1 landing page as the final long-term app home without review.`
- `Do not introduce unnecessary architecture before the module list is stable enough.`

---

## Delivery Recommendation

Recommendation:
`design as a staged extension`

Reason:
`The need is clear, but this should come after at least a small set of modules exists. The 4 Pillars route can remain standalone for now while AXZIO accumulates enough module surfaces to justify a true home screen.`

---

## Implementation Handoff Notes

`When implementation begins, the first question should be whether Modules Home becomes the new root paid-app entry point or a dedicated sub-route such as /app or /modules.`

`The home should likely be driven by a small static module configuration first, for example:`
- `id`
- `title`
- `description`
- `route`
- `status`
- `ctaLabel`

`Initial implementation should prioritize clarity over visual complexity.`

`A card/tile-based layout is preferred over a dense dashboard for the first pass.`

`Module status support should include:`
- `Live`
- `In Progress`
- `Coming Soon`

`The page should be able to represent:`
- live routes
- hidden/future routes
- placeholder modules not yet implemented

---

## Final Rule

Do not treat conceptual app-structure ideas from `ne3ula-knowledge` as implemented behavior unless they are present in the current `axzio` repo.

Default principle:

**Current code first. Canonical AXZIO doc second. Conceptual knowledge repo third.**
