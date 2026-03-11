# AXZIO System Role

## Purpose

AXZIO is the interface and application layer for the NE3ULA system. Its job is
to translate system models into user-facing interaction, stateful navigation,
and operational workflows.

AXZIO does not define the philosophy, ontology, or canonical models behind the
system. Those remain upstream in `ne3ula-knowledge` and `ne3ula-system`.

## Primary Responsibilities

- present the Identity Stack through a usable interface
- manage application state and navigation state
- expose system actions through UI components and interaction flows
- surface guidance, drift signals, and path alignment feedback
- host the primary companion interface for AI.d

## What AXZIO Owns

AXZIO should contain:

- application architecture
- UI structure and components
- command deck and navigation patterns
- state orchestration for interface behavior
- documentation describing interface behavior and integration boundaries

## What AXZIO Does Not Own

AXZIO should not become the source of truth for:

- ontology, philosophy, or worldview definitions
- canonical path models
- deep system theory
- public marketing or entry-point messaging
- simulation or game logic owned by `ne3ulaverse`

## Position in the NE3ULA Ecosystem

AXZIO sits between system definition and user interaction:

1. `ne3ula-knowledge` defines concepts and meaning.
2. `ne3ula-system` defines structure, mechanics, and architecture.
3. `axzio` operationalizes those definitions as interface behavior.
4. `ne3ulaverse` may consume or extend AXZIO interaction outcomes in simulation.
5. `ne3ula-site` introduces the ecosystem publicly and can route users into AXZIO.

## Operating Principle

AXZIO is a translation layer, not a theory layer.

Its documentation and implementation should answer questions such as:

- what does the user see?
- what can the user do?
- what state changes occur?
- what signals are surfaced by the system?
- how does guidance appear in the interface?

It should avoid re-explaining why the underlying model exists unless required
for implementation clarity.
