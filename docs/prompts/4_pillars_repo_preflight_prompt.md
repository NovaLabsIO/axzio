# 4 Pillars Repo Preflight Prompt

You are working inside the existing AXZIO codebase.

Do **not** implement the 4 Pillars feature yet.

Your job in this step is to inspect the current repo state and determine the correct architectural placement, naming, integration pattern, and implementation approach for a new standalone paid-version module called **4 Pillars**.

Before doing anything else, read and follow:

- `AGENTS.md` if present
- `docs/AXZIO_SYSTEM_V1.md`
- `docs/AXZIO_SESSION_START_PROMPT.md`
- `docs/axzio_cross_repo_inspection_order.md`
- `docs/AXZIO_IMPLEMENTATION_PROMPT_TEMPLATE.md`
- `docs/features/4_pillars_feature_request.md`

Also inspect the relevant implementation files in `axzio` before making recommendations.

At minimum, inspect:

- `package.json`
- `src/routes/+page.svelte`
- `src/routes/reading/+page.svelte`
- `src/routes/reading/result/+page.svelte`
- `src/routes/api/analyze/+server.ts`
- `src/lib/identity/schema.ts`
- any existing shared UI primitives, route-group patterns, or feature/module patterns already present in the repo

After grounding in the AXZIO repo, inspect relevant conceptual docs in `ne3ula-knowledge` only if needed for alignment. Do not treat conceptual docs as implemented behavior unless confirmed in the `axzio` repo.

## Source-of-truth rules

Treat:
- `axzio` as implementation truth
- `ne3ula-knowledge` as conceptual / ontology guidance

If there is any mismatch:
- current `axzio` code wins for statements about live app behavior
- `docs/AXZIO_SYSTEM_V1.md` is the canonical app doc unless code proves otherwise
- `ne3ula-knowledge` may inform intended structure, ontology, naming, and future direction

Label findings explicitly as:
- **Implemented now**
- **Intended next**
- **Conceptual only**

Do not silently blend them.

---

## Feature context

The feature is a new standalone module called **4 Pillars**.

Core concept:
- A mobile-first standalone module/view
- Separate from the current AXZIO v1 quiz/card flow
- Intended as part of the broader paid-version app in the same repo
- Should be reachable after the existing flow in some way, but not collapsed into the current v1 result page

Purpose:
- Allow the user to assess current vs target balance across:
  - Body
  - Mind
  - Heart
  - Spirit

Primary interactions:
- select timeframe
- adjust current-state values with sliders
- toggle to target-state editing in the same view
- choose target mode:
  - Restore Balance
  - Maintain Rhythm
  - Set Custom
  - Shift Toward Growth Goal
- submit to receive summary + next-best-action guidance

Important UX/copy constraint:
- Do **not** use “Alchemy” as a visible UX label, title, or section name
- “Alchemy” may remain internal inspiration only
- Use plain language such as:
  - 4 Pillars
  - Current Balance
  - Target Balance
  - Guidance
  - Suggestions

Timeframe guidance:
- Today is the default for the first version
- This Week / Month / Quarter / Year may exist visually or structurally, but deeper review-session logic can be phased later

Data guidance:
- smooth slider UX is desired
- normalized 1–10 values are preferred for stored/logic interpretation
- raw slider values may also be retained if this does not add significant complexity

Suggested internal model:
- `timeframe: today | week | month | quarter | year`
- `targetMode: restore | maintain | custom | growth`
- `currentRaw: { body, mind, heart, spirit }`
- `targetRaw: { body, mind, heart, spirit }`
- `currentScore: { body, mind, heart, spirit }`
- `targetScore: { body, mind, heart, spirit }`

Future extension:
- per-pillar goals
  - one primary goal
  - three subgoals
- later AI.d interpretation and report integration

---

## Your task

Review the repo and determine:

1. Where this module belongs architecturally
   - route
   - route group
   - module namespace
   - component structure
   - whether it should live beside current v1 routes or under a broader app area

2. What current AXZIO patterns it should reuse
   - styling conventions
   - layout patterns
   - state/data patterns
   - route/file naming conventions

3. What should be implemented now vs staged later

4. What storage strategy makes the most sense
   - local-only draft state
   - session/local storage
   - new Supabase table(s)
   - whether goals should be JSON initially

5. What the minimal production-safe first implementation should be

Do **not** write code yet unless explicitly asked after this preflight.

---

## Required output format

Respond in this order:

### 1) Current implementation reality
- summarize the current AXZIO repo state relevant to this feature
- list the files inspected
- describe constraints from the current codebase

### 2) Conceptual alignment
- summarize any relevant `ne3ula-knowledge` alignment
- explicitly label implemented vs intended vs conceptual

### 3) Architectural recommendation
- recommend the correct placement for the 4 Pillars module
- recommend route and file organization
- explain why this fits the current repo

### 4) Storage recommendation
- recommend how the data should be handled in the first build
- recommend whether Supabase should be wired now or later
- recommend how to handle raw values vs normalized scores

### 5) Staged implementation plan
Break the work into phases such as:
- preflight / architecture confirmation
- route/module shell
- interaction + state
- guidance output
- persistence
- future goal editing

### 6) Tool-by-tool execution steps
For each step, specify:
- **Codex in VS Code** for repo-aware inspection and multi-file implementation work
- **Terminal** for branch creation, local dev, tests, build, commit, push
- **GitHub** for file verification, diff review, and PR inspection

### 7) Next recommended implementation prompt
Provide the next Codex-ready prompt that should be used only after this preflight is complete.

---

## Final rule

Default principle:

**Current code first. Canonical AXZIO doc second. Conceptual knowledge repo third.**
