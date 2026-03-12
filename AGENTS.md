# AGENTS.md

This repository is the application layer for AXZIO.

## Purpose

Use this repository to build and document:
- the AXZIO interface
- user state systems
- command deck logic
- constellation and navigation views
- application behavior and structure

## Primary Role

This repo is for:
- app architecture
- UI implementation
- interaction systems
- navigation/state logic

## Boundaries

This repo should contain:
- docs related to AXZIO implementation
- source code
- assets used by the application
- app-level architecture

This repo should not contain:
- broad philosophical archive material
- public website implementation
- unrelated legacy concepts
- game logic that belongs in ne3ulaverse

## Relationship to Other Repos

- ne3ula-knowledge contains the conceptual source material for AXZIO.
- ne3ula-system defines the role of AXZIO in the broader ecosystem.
- ne3ula-site is the public-facing entry point.
- ne3ulaverse contains progression/game systems that may later integrate with AXZIO.

## Canonical Use

Open this repo when building the AXZIO product itself.
# AXZIO Agent Guide

## Mission
Build AXZIO v1: a lightweight identity reading web app that helps users answer the question:

"Who am I?"

The product flow is:

Landing page  
→ 10-question reflection  
→ AI identity analysis  
→ Identity Signal result  
→ share/export card

The goal of v1 is **speed and clarity**, not complexity.

---

## Core principles

1. Keep v1 extremely small and shippable.
2. Do not expand beyond the Identity Reading flow unless explicitly asked.
3. Reuse components wherever possible.
4. Favor clarity and speed over abstraction.
5. Preserve clean separation between UI, configuration, and AI logic.
6. Never rewrite large sections of the app unnecessarily.
7. Ask for approval before introducing major dependencies.

---

## Product requirements

AXZIO v1 must include:

• Landing page  
• 10 reflection questions  
• AI-generated identity reading  
• visual Identity Signal card  

The AI reading should include:

- primary mode
- secondary mode
- archetype
- core pattern
- current challenge
- growth vector
- suggested next action

---

## Identity Model

### Modes

People  
Pleasure  
Production  
Reflection

---

### Archetypes

Architect  
Explorer  
Builder  
Alchemist  
Catalyst  
Guardian

---

### Growth Vectors

Launch  
Clarify  
Connect  
Explore  
Stabilize  
Transform

---

## Constraints

For AXZIO v1:

• No authentication system  
• No database requirement  
• No unnecessary frameworks  
• Use environment variable for OpenAI API key  
• Validate AI output against a schema  

The goal is a **simple working prototype**.

---

## Safe Task Order

Agents should generally implement features in this order:

1. Project scaffold
2. Configuration files
3. UI flow
4. AI analysis endpoint
5. Result rendering
6. Visual polish
7. Export/share functionality

---

## Approval Checkpoints

Require human approval before:

• adding authentication  
• adding persistent storage  
• adding new dependencies  
• modifying core architecture  
• introducing paid integrations

---

## Development Philosophy

AXZIO is an **identity mirror**, not a personality quiz.

The product should feel:

• insightful  
• calm  
• reflective  
• meaningful

Avoid:

• gimmicky UX
• unnecessary complexity
• feature creep

Focus on delivering **one powerful experience**:

Helping the user see who they are becoming.
