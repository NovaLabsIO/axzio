# ⚠️ AXZIO V1 CANONICAL IMPLEMENTATION DOCUMENT

This document describes the CURRENT running AXZIO implementation.
All implementation prompts, agent tasks, and code changes must reference this document first.
If discussion concepts differ from this document, the codebase and this document take precedence.

# AXZIO V1 System Overview

This document reflects the current AXZIO v1 implementation present in this repository at the time of inspection.

Note: this document reflects the inspected workspace state on branch `axzio-result-format-test`. If canonical `axzio-v1` differs, the codebase should be treated as the source of truth. Differences from external ontology, prior discussion, or other repositories must be labeled explicitly rather than blended into current implementation behavior.

## Version

`AXZIO_SYSTEM_V1.md` tracks the current implementation of AXZIO v1.

If the system evolves in a breaking way, create a new document such as `AXZIO_SYSTEM_V2.md` rather than silently redefining this file.

## Scope of Truth

This file is the source of truth for implemented AXZIO v1 behavior in this repository only.

- If behavior, vocabulary, schema, or flow is explicitly implemented in this repo, it can be documented as current application behavior.
- If a concept exists in discussion, prior prompts, or external knowledge sources but is not explicitly implemented in this repo, it must be labeled as `Intended / External` and not documented as current application behavior.
- When implementation and external ontology diverge, implementation in this repo wins for this document unless the code changes.

## AXZIO V1 System Flow

Landing Page
↓
10 Question Reflection
↓
`/api/analyze`
↓
OpenAI JSON Schema Response
↓
`IdentityReading` Object
↓
Session Storage
↓
Result Page
↓
Share Card + Supabase Capture

## External Ontology Alignment Note

The archetypes, modes, result fields, and flow documented here are the ones currently implemented in this repo.

- If the broader NE3ULA knowledge system defines additional, renamed, or differently-structured archetypes or modes, that ontology should be treated as `Intended / External` until it is explicitly implemented in this repository.
- This prevents external conceptual material from being mistaken for current AXZIO v1 application behavior.

## Naming Normalization

The current implementation uses three naming variants for the same conceptual signal:

- `growthVector`: API and result-object field name
- `growthFocus`: card/capture snapshot naming
- `growth_focus`: Supabase column naming

These are naming variants of the same underlying signal and should be treated as equivalent unless the code is changed to separate them.

## Analysis Flow

Requested conceptual flow:

User Answers
↓
Scoring
↓
Mode Vector
↓
Archetype Resolution
↓
AI Interpretation
↓
Result Object
↓
Result Page
↓
Share Card

Current code reality:

1. User Answers
The user answers 10 fixed reflection prompts in [`src/routes/reading/+page.svelte`](src/routes/reading/+page.svelte) using `REFLECTION_QUESTIONS` from [`src/lib/config/questions.ts`](src/lib/config/questions.ts).

2. Validation
Before analysis, the client and server both use [`src/lib/identity/signal-validation.ts`](src/lib/identity/signal-validation.ts) to reject blank, placeholder, repeated-character, and no-real-word responses.

3. Scoring
There is no explicit deterministic scoring system in local code.

4. Mode Vector
There is no explicit mode-vector calculation in local code.

5. Archetype Resolution
There is no explicit deterministic archetype-resolution function in local code.

6. AI Interpretation
[`src/routes/api/analyze/+server.ts`](src/routes/api/analyze/+server.ts) sends the 10 responses plus allowed vocabularies for modes, archetypes, and growth vectors to OpenAI. The model is instructed to return only JSON matching the schema in [`src/lib/identity/schema.ts`](src/lib/identity/schema.ts).

7. Result Object
The server parses and validates the OpenAI JSON against the `IdentityReading` schema, then returns it as the API response.

8. Result Page
[`src/routes/reading/+page.svelte`](src/routes/reading/+page.svelte) stores the validated result in `sessionStorage` under `axzio.identity-reading` and navigates to [`src/routes/reading/result/+page.svelte`](src/routes/reading/result/+page.svelte).

9. Share Card
The result page generates the export/share image locally via canvas in [`src/routes/reading/result/+page.svelte`](src/routes/reading/result/+page.svelte). The `IdentitySignalCard.svelte` component exists but is not currently rendered anywhere in `src`.

## Result Object Schema

Fields as they exist in code in [`src/lib/identity/schema.ts`](src/lib/identity/schema.ts):

```ts
type IdentityReading = {
  primaryMode: Mode;
  secondaryMode: Mode;
  archetype: Archetype;
  corePattern: string;
  currentChallenge: string;
  growthVector: GrowthVector;
  suggestedNextAction: string;
};
```

Required JSON keys returned by `/api/analyze`:

- `primaryMode`
- `secondaryMode`
- `archetype`
- `corePattern`
- `currentChallenge`
- `growthVector`
- `suggestedNextAction`

Important naming note:

- The active result object uses camelCase `growthVector`.
- The capture snapshot and Supabase row rename this to `growthFocus` and `growth_focus` respectively.

## Archetypes

Canonical archetypes in [`src/lib/config/archetypes.ts`](src/lib/config/archetypes.ts):

- `Architect`
- `Explorer`
- `Builder`
- `Alchemist`
- `Catalyst`
- `Guardian`

## Modes

Canonical modes in [`src/lib/config/modes.ts`](src/lib/config/modes.ts):

- `People`
- `Pleasure`
- `Production`
- `Reflection`

Requested role explanation:

- `People`: connection, care, and relational energy.
- `Production`: building, output, and meaningful forward motion.
- `Pleasure`: joy, sensation, and what feels deeply alive.

Implementation note:

- `Reflection` is also a current canonical mode in code, even though it was not listed in the requested subsection prompt.
- `Reflection` should not be omitted from implementation guidance, prompts, schemas, or system documentation unless the code changes first.

## Relationship Between Core Result Fields

The current relationship is schema-level and prompt-level, not deterministic application logic.

- `primaryMode`: the dominant orientation the model selects from the allowed modes.
- `secondaryMode`: the supporting orientation the model selects from the same mode list.
- `archetype`: a single archetype label the model selects from the allowed archetype list.
- `growthVector`: the constructive direction the model selects from the allowed growth-vector list.
- `corePattern`: free-text interpretation of the user’s behavior, motivation, and emotional logic.
- `currentChallenge`: free-text sentence describing current friction or trade-off.
- `suggestedNextAction`: free-text practical next step.

In the UI, these fields are related as follows:

- `archetype` is the headline identity label on the result page and the share card.
- `primaryMode`, `secondaryMode`, and `growthVector` form the top signal set on the result page.
- `corePattern` is expanded into the “Core Pattern” interpretation block.
- `currentChallenge` fills the “Tension” block.
- `growthVector` also fills the “Direction” block and share card “Growth Focus” field.
- `suggestedNextAction` fills the “Suggested Next Move” block and the share card “Next Action” field.

There is no local rule engine that derives one field from another. Their coherence is produced by the prompted model response and enforced only by enum/schema validation.

## Result Page Layout

Active results page: [`src/routes/reading/result/+page.svelte`](src/routes/reading/result/+page.svelte)

Current layout order:

1. Hero header
- Eyebrow: `AXZIO ID`
- H1: `archetype`
- Hero summary sentence
- Three signal pills:
- `Primary Mode`
- `Secondary Mode`
- `Growth Focus`

2. Current Identity Pattern section
- Section label: `Current Identity Pattern`
- Two-column grid:
- `Core Pattern`
- `Why this fits`

3. Tension section
- Section label: `Tension`
- One card:
- `Current Challenge`

4. Direction section
- Section label: `Direction`
- One card:
- `Growth Focus`
- Growth vector name
- growth-vector directional copy

5. Suggested Next Move section
- Section label: `Suggested Next Move`
- One highlighted card:
- `suggestedNextAction`

6. Your AXZIO ID section
- Section label: `Your AXZIO ID`
- Supporting copy
- `Export Card` button
- `Share Card` button
- Optional `shareMessage`

7. Save this result with your email section
- Section label: `Save this result with your email`
- Supporting copy
- Email input
- `Save Email + Result` button
- Helper text
- Optional `emailMessage`

8. Quick Feedback section
- Section label: `Quick Feedback`
- Accuracy prompt
- Radio options: `Yes`, `Somewhat`, `No`
- Optional textarea
- `Submit Feedback` button
- Optional confirmation or error message

9. Footer CTA
- `Start New Reading` link

Empty-state behavior:

- If no valid session-stored reading exists, the page shows a minimal `AXZIO ID` hero, an empty-state message, and the `Start New Reading` link.

## Share Card Layout

Active card generation path: canvas rendering inside [`src/routes/reading/result/+page.svelte`](src/routes/reading/result/+page.svelte)

Current export/share card facts:

- Output format: PNG
- Filename: `axzio-identity-signal.png`
- Size: `1080 x 1080`
- Accent theme is derived from `primaryMode`
- Generated client-side with canvas, not server-side

Canvas card structure:

1. Header
- Label: `AXZIO ID`
- Large hero value: `archetype`
- Sub-line: `primaryMode • secondaryMode • growthVector`

2. Field grid
- Row 1 left: `Primary Mode`
- Row 1 right: `Secondary Mode`
- Row 2 full width: `Core Pattern`
- Row 3 full width: `Current Challenge`
- Row 4 left: `Growth Focus`
- Row 4 right: `Next Action`

3. Footer
- Small footer text: `axzio.ai`

Adaptive layout behavior:

- The card tests several line-count variants for `corePattern`, `currentChallenge`, and `suggestedNextAction`.
- `suggestedNextAction` can shrink through multiple body font sizes to fit.
- Long values are wrapped and then truncated with ellipsis when needed.

Unused share card component:

- [`src/lib/components/IdentitySignalCard.svelte`](src/lib/components/IdentitySignalCard.svelte) defines a styled DOM card with:
- `Identity`
- `Primary Mode`
- `Secondary Mode`
- `Signal`
- `Growth Focus`
- This component is not currently imported or rendered anywhere in `src`.

## Supabase Data Schema

Primary results table defined in [`supabase/schema.sql`](supabase/schema.sql):

### `public.axzio_results`

- `id bigint generated always as identity primary key`
- `archetype text not null`
- `primary_mode text not null`
- `secondary_mode text not null`
- `growth_focus text not null`
- `core_pattern text not null`
- `current_challenge text not null`
- `suggested_next_action text not null`
- `card_snapshot jsonb not null`
- `prompt_version text not null`
- `user_agent text not null default ''`
- `created_at timestamptz not null default timezone('utc', now())`

Current `card_snapshot` payload shape is produced in [`src/lib/server/capture-store.ts`](src/lib/server/capture-store.ts):

```ts
type ResultCaptureSnapshot = {
  archetype: IdentityReading['archetype'];
  primaryMode: IdentityReading['primaryMode'];
  secondaryMode: IdentityReading['secondaryMode'];
  growthFocus: IdentityReading['growthVector'];
  corePattern: IdentityReading['corePattern'];
  currentChallenge: IdentityReading['currentChallenge'];
  suggestedNextAction: IdentityReading['suggestedNextAction'];
};
```

Related capture tables:

### `public.axzio_feedback`

- `id bigint generated always as identity primary key`
- `result_id bigint not null references public.axzio_results(id) on delete cascade`
- `feedback_choice text not null check (feedback_choice in ('Yes', 'Somewhat', 'No'))`
- `feedback_text text not null default ''`
- `user_agent text not null default ''`
- `created_at timestamptz not null default timezone('utc', now())`

### `public.axzio_email_submissions`

- `id bigint generated always as identity primary key`
- `result_id bigint not null references public.axzio_results(id) on delete cascade`
- `email text not null`
- `user_agent text not null default ''`
- `created_at timestamptz not null default timezone('utc', now())`

Persistence note:

- Raw questionnaire answers are not stored in Supabase.
- Only derived reading fields plus email/feedback metadata are stored.

## Files Responsible For Each Layer

- Analysis logic: [`src/routes/api/analyze/+server.ts`](src/routes/api/analyze/+server.ts)
- Response validation: [`src/lib/identity/signal-validation.ts`](src/lib/identity/signal-validation.ts)
- Result schema and parsing: [`src/lib/identity/schema.ts`](src/lib/identity/schema.ts)
- Archetype definitions: [`src/lib/config/archetypes.ts`](src/lib/config/archetypes.ts)
- Mode definitions: [`src/lib/config/modes.ts`](src/lib/config/modes.ts)
- Growth vector definitions: [`src/lib/config/growth-vectors.ts`](src/lib/config/growth-vectors.ts)
- Question set: [`src/lib/config/questions.ts`](src/lib/config/questions.ts)
- Result generation entry from UI: [`src/routes/reading/+page.svelte`](src/routes/reading/+page.svelte)
- Results page: [`src/routes/reading/result/+page.svelte`](src/routes/reading/result/+page.svelte)
- Share card generator: [`src/routes/reading/result/+page.svelte`](src/routes/reading/result/+page.svelte)
- Landing page hero: [`src/routes/+page.svelte`](src/routes/+page.svelte)
- Capture API: [`src/routes/api/capture/+server.ts`](src/routes/api/capture/+server.ts)
- Supabase capture persistence: [`src/lib/server/capture-store.ts`](src/lib/server/capture-store.ts)
- Supabase admin client and connectivity probe: [`src/lib/server/supabase.ts`](src/lib/server/supabase.ts)
- Supabase SQL schema: [`supabase/schema.sql`](supabase/schema.sql)

## UI Component Render Locations

- Results page is rendered at route [`src/routes/reading/result/+page.svelte`](src/routes/reading/result/+page.svelte)
- Share/export card is generated from [`src/routes/reading/result/+page.svelte`](src/routes/reading/result/+page.svelte) via canvas
- Landing page hero is rendered at route [`src/routes/+page.svelte`](src/routes/+page.svelte)
