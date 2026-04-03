# Claude Collaboration Guide

This document describes how to work effectively with Claude on the Fight Kiki project.

## Project Context

**Fight Kiki** is a 2-player networked fighting game. It started as a local-only game in a 2-3 hour learning session and has evolved to include:
- Socket.io multiplayer with room codes
- Custom player names
- Clean UI/UX for host/join flow

The scope is intentionally small — a complete, playable game rather than a framework or engine.

## How to Ask Claude for Help

### Be Specific
- **Good**: "The room code overlaps the menu. Move it to the top-right corner."
- **Vague**: "Fix the layout."

### Reference Files and Line Numbers
- Use format: `src/TitleScene.js:60` to point to specific code locations

### Describe the User Experience
- What do players see?
- What should they see instead?
- Where does it break?

### Example Request
```
In SelectScene, when a player is waiting for their opponent after locking in moves,
the waiting text ("Waiting for opponent...") should not overlap the button area.
Can you move it higher or add a semi-transparent overlay?
```

## Code Guidelines

### Keep It Simple
- No over-engineering. Scope should stay small.
- Pure functions (like `combat.js`) are good — they're testable and reusable.
- Scene logic (Phaser) stays in scene files.

### Naming Conventions
- Moves are defined in `src/moves.js` as an enum (`MOVES.PUNCH`, etc.)
- Socket events are lowercase with hyphens: `create-room`, `submit-moves`, `opponent-joined`
- Scene data passed via `init()` uses camelCase: `playerNumber`, `opponentName`

### Testing
- Game logic goes in pure modules (`combat.js`)
- UI/animations stay in scenes (not tested via Vitest, tested manually)
- All new logic should have corresponding unit tests in `combat.test.js`

### No Breaking Changes Without Discussion
- Before refactoring core systems, ask first
- The game is playable and relatively stable — preserve that

## Project Layout

The codebase is organized for clarity:
- `server/` — All backend code (Express, Socket.io, room management)
- `src/` — All frontend code (Phaser scenes, game logic, utilities)
- Tests live next to the code they test (e.g., `combat.test.js` next to `combat.js`)

## Performance Notes

- Phaser bundles at ~1.2MB gzipped (expected for a full game engine)
- No optimization focus yet; the game runs smoothly on modern browsers
- Mobile: target landscape orientation (portrait not yet supported)

## Known Limitations

1. **No persistence** — Rooms disappear on disconnect; player stats not saved
2. **No error recovery** — Mid-fight disconnect shows error modal; no rejoin
3. **No sound** — Pure visual feedback (animations, screen shake)
4. **Mobile** — Only tested in landscape; portrait needs layout work
5. **Scalability** — Single-server, no load balancing or databases

These are intentional for the learning scope. Flag if any become pain points.

## Asking for Features

The project is feature-complete for a 2-3 hour learning session. Before requesting new features, consider:
- Does it fit the "complete game, not a framework" goal?
- Can it be done in under 1 hour?
- Is it blocking fun gameplay?

Examples of good additions:
- UI/UX polish (button placement, color tweaks, animations)
- Bug fixes (overlapping text, disconnect issues)
- Simple gameplay tweaks (number of rounds, move names)

Examples of scope creep:
- Leaderboards / persistence
- Matchmaking / lobbies
- Custom skins / cosmetics
- Sound design

## Committing Changes

- Claude commits after completing a feature or fix
- Commit messages are clear: "Add feature X" or "Fix Y bug"
- Co-author as: `Co-Authored-By: Jordi <...>` and `Co-Authored-By: Ferran <...>`

## Git Workflow

- Single `master` branch (no feature branches for learning project)
- All code is production-ready after test pass
- Builds via `npm run build` produce `dist/` artifacts (not committed)

## Questions Before Implementation

Claude asks these questions before starting large tasks:

1. **Scope**: Is this bounded? Can it be completed in 1-2 hours?
2. **Breaking changes**: Does this change how players experience the game?
3. **Testing**: Will this need new tests?
4. **Mobile**: Does this affect mobile responsiveness?

## Feedback Loop

If something doesn't work:
1. Run the game locally: `npm run server` + `npm run dev`
2. Try to reproduce the issue
3. Describe what you see vs. what you expect
4. Provide steps to reproduce

Claude will investigate, fix, test, and commit.

---

Happy building! 🎮
