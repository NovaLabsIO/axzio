# AXZIO User Flow

## Objective

This document describes the high-level journey of a user operating inside the
AXZIO interface.

## Primary Journey

### 1. Entry

The user enters AXZIO from a launch context such as an authenticated session, a
linked portal, or a resumed workspace.

The interface should establish:

- identity context
- session state
- current alignment or drift indicators
- any pending guidance or notable events

### 2. Orientation

The user lands in the command deck.

The command deck should answer four immediate questions:

- who am I operating as right now?
- what is my current state?
- what requires attention?
- where can I go next?

### 3. Assessment

The interface surfaces current signals from the Identity Engine and AI.d:

- alignment status
- drift warnings
- active path markers
- relevant recommendations

At this stage the user can pause, inspect, or request clarification before
taking action.

### 4. Navigation

The user moves into a target system or view, such as:

- a path or node in constellation view
- a diagnostics or reflection surface
- a command execution flow
- an AI.d conversation or intervention panel

Navigation should preserve context so the user understands why a destination is
available and how it connects to their current path.

### 5. Action

The user performs an action through the interface:

- selecting a route
- acknowledging guidance
- reviewing a drift event
- opening a system detail
- initiating a task or command

The application should make resulting state changes legible.

### 6. Reflection and Guidance

After action, AXZIO should update the user’s visible state and allow AI.d to:

- explain observed changes
- identify drift or reinforcement patterns
- propose next steps
- maintain continuity across sessions

### 7. Continuation

The user either:

- returns to the command deck
- moves deeper into another interface context
- exits while preserving session continuity for later resumption

## Design Implications

- the command deck must work as the stable center of the experience
- navigation should always expose context, not just destination
- alignment and drift signals should be visible without overwhelming the user
- AI.d should feel embedded in the flow rather than bolted onto it
