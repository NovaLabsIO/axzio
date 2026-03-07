# AXZIO Architecture

AXZIO is the application layer of the NE3ULA ecosystem.

## Purpose

AXZIO provides the interactive command interface that allows a user to navigate
the NE3ULA ecosystem.

Conceptually this can be understood as:

User → Ship → Command Console → Constellation Navigation

## Core Views

### Command Deck
The primary interface state.

Responsibilities:
- display user state
- access systems
- surface progression data

### Constellation View
A zoomed-out view showing the user's position in the NE3ULA system.

Responsibilities:
- visualize user path
- reveal available quests / actions
- show connections between knowledge, progression, and experience

### Navigation Mode
Focused control view used to move through systems.

Responsibilities:
- select systems
- activate interactions
- move between layers

## Relationship to Other Repositories

ne3ula-system  
Defines ecosystem architecture.

ne3ula-knowledge  
Contains conceptual foundations and documentation.

ne3ulaverse  
Defines progression and world mechanics surfaced by AXZIO.
