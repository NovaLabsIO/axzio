# AXZIO Cross-Repo Inspection Order

Use this file at the start of future AXZIO implementation sessions.

Its purpose is to keep work grounded across:
- the **AXZIO app repo** (`axzio`) as the implementation source of truth
- the **NE3ULA knowledge repo** (`ne3ula-knowledge`) as the conceptual / ontology source

---

## Core Rule

Treat the repositories differently:

- **`axzio` = current implementation truth**
- **`ne3ula-knowledge` = conceptual architecture / intended system / ontology**

If they differ:
1. `axzio` code wins for statements about current app behavior.
2. `docs/AXZIO_SYSTEM_V1.md` is the current implementation document unless code proves otherwise.
3. `ne3ula-knowledge` informs naming, structure, future modules, ontology, and intended evolution.
4. Any mismatch must be labeled explicitly as one of:
   - **Implemented now**
   - **Intended next**
   - **Conceptual only**

---

## Required Starting Order

### 1) AXZIO repo: operating guidance first
Read these before making implementation recommendations:

- `AGENTS.md` *(if present)*
- repo-specific feature/task docs relevant to the request
- branch/context notes if the task is tied to a specific branch

Purpose:
- understand repo workflow rules
- understand guardrails for edits
- understand conventions for prompts / agent behavior

---

### 2) AXZIO repo: implementation truth
Read these next:

- `docs/AXZIO_SYSTEM_V1.md`
- `package.json`

Purpose:
- confirm current product behavior
- confirm stack, scripts, and dependencies
- confirm naming and flow before suggesting changes

---

### 3) AXZIO repo: active implementation files
Inspect the files directly involved in the requested task.

Common starting set:

- `src/routes/+page.svelte`
- `src/routes/reading/+page.svelte`
- `src/routes/reading/result/+page.svelte`
- `src/routes/api/analyze/+server.ts`
- `src/routes/api/capture/+server.ts`
- `src/lib/identity/schema.ts`
- `src/lib/identity/signal-validation.ts`
- `src/lib/config/archetypes.ts`
- `src/lib/config/modes.ts`
- `src/lib/config/growth-vectors.ts`
- `src/lib/config/questions.ts`
- `src/lib/server/capture-store.ts`
- `src/lib/server/supabase.ts`
- `supabase/schema.sql`

Purpose:
- verify what is truly live
- inspect local conventions
- prevent guidance drift

---

### 4) NE3ULA knowledge repo: agent / ontology entrypoints
After grounding in current app reality, inspect the conceptual repo.

Start with:

- `AGENTS.md`
- `WORKING_DOCS/NE3ULA_ONTOLOGY.md`
- `WORKING_DOCS/NE3ULA_KNOWLEDGE_MAP.md`
- `WORKING_DOCS/SYSTEM_INDEX.md`
- `WORKING_DOCS/MIGRATION_RULES.md`

Purpose:
- understand the larger NE3ULA system
- understand where AXZIO sits in the system
- locate the correct conceptual docs before using them

---

### 5) NE3ULA knowledge repo: AXZIO-specific conceptual docs
Then inspect AXZIO-relevant conceptual material, especially:

- everything under `WORKING_DOCS/interface/axzio/`

Also inspect engine documents that shape AXZIO logic or outputs, especially if the task touches identity logic, progression, or recommendations:

- `WORKING_DOCS/engine/E3/human-engine/identity-stack/`
- `WORKING_DOCS/engine/E3/human-engine/decision-engine/`
- `WORKING_DOCS/engine/E3/human-engine/alchemist-pyramid/`
- related system-engine / AI.d docs when relevant

Purpose:
- align future development with ontology
- identify intended modules, terms, flows, and system relationships
- inform design without falsely treating conceptual material as already implemented

---

## Interpretation Rules

When answering AXZIO development questions:

### Use `axzio` to answer:
- what the app currently does
- how the current UI behaves
- what schema is active
- what route/API/component owns a behavior
- what is currently stored or rendered
- what branch-specific implementation exists

### Use `ne3ula-knowledge` to answer:
- what AXZIO is supposed to become
- how AXZIO fits into the NE3ULA system
- ontology, naming, model relationships, and conceptual structure
- future module logic
- broader user journey logic

### Never blend them silently
If a concept exists in `ne3ula-knowledge` but not in `axzio`, do **not** describe it as live app behavior.

Instead say one of:
- “This is implemented in AXZIO now.”
- “This appears intended in the knowledge repo but is not yet implemented in the app.”
- “This is conceptual / architectural guidance rather than current product behavior.”

---

## Working Output Format For Future Sessions

When starting a new AXZIO task, summarize findings in this order:

### A. Current implementation reality
- current branch / repo context
- relevant implementation files inspected
- confirmed live behavior
- constraints from current code

### B. Conceptual alignment
- relevant knowledge-repo docs inspected
- intended structure or naming
- where the implementation is aligned
- where the implementation currently diverges

### C. Recommendation type
Label the proposed work as one of:
- **bug fix / implementation correction**
- **AXZIO v1 extension**
- **future-facing architecture prep**
- **conceptual alignment only**

---

## Tooling Rule For Guidance

When giving implementation steps, specify the tool for each step.

Example pattern:
- **Codex in VS Code** — for multi-file code edits, repo-aware changes, and implementation work
- **Terminal** — for branch creation, installs, local dev, tests, builds, git status, commits, and pushes
- **GitHub** — for PR inspection, branch comparison, file verification, and repo-level review
- **ChatGPT Project / Canvas doc** — for persistent working docs, checklists, prompts, and coordination notes

This keeps execution grounded and reduces ambiguity.

---

## Minimal Preflight Checklist

Before giving AXZIO implementation guidance, verify:

- repo and branch being discussed
- `AGENTS.md` reviewed if available
- `docs/AXZIO_SYSTEM_V1.md` reviewed
- relevant implementation files reviewed
- relevant `ne3ula-knowledge` docs reviewed for conceptual alignment
- any conceptual vs implemented mismatch explicitly labeled

---

## Default Principle

**Current code first. Canonical app doc second. Conceptual knowledge repo third.**

That order preserves implementation accuracy while still allowing AXZIO to evolve toward the broader NE3ULA system.

