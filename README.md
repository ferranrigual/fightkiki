# Fight Kiki

A networked two-player web-based fighting game built with **Phaser 3**, **Vite**, and **Socket.io**.



https://github.com/user-attachments/assets/70c2cfbb-5ef5-4440-99d8-b1f248310b8a



## Game Overview

Fight Kiki is a turn-based combat game where two players secretly choose sequences of 5 moves each, then watch them resolve in real-time. Combat uses rock-paper-scissors mechanics: **Punch** beats **Low Kick**, **Low Kick** beats **Defend**, **Defend** beats **Punch**.

### How to Play

1. **Create or Join a Room** — One player hosts and gets a 4-digit room code; the other joins using that code
2. **Enter Your Name** — Each player enters their name before move selection
3. **Select Moves** — Both players simultaneously pick 5 moves (Punch, Low Kick, or Defend) in order
4. **Watch the Fight** — Moves auto-play round by round with animations and scoring
5. **See Results** — Final scores and winner are displayed

## Quick Start

### Prerequisites
- Node.js 16+
- npm

### Installation

```bash
npm install
```

### Running

Open **two terminal windows**:

```bash
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run dev
```

The game opens at `http://localhost:5173`. Open it in two browser tabs (or two devices on the same network) to play.

## Architecture

### Frontend (Phaser 3 + Vite)
- **TitleScene** — Main menu with Host/Join options
- **NameScene** — Player name entry (synced via server)
- **SelectScene** — Move selection UI (simultaneous for both players)
- **FightScene** — Auto-play fight with round-by-round animation
- **ResultScene** — Final scores and winner announcement

### Backend (Node.js + Express + Socket.io)
- **Room Management** — Generate 4-digit codes, manage room state
- **Name Synchronization** — Both players submit names; server broadcasts when ready
- **Move Submission** — Collect moves from both players; trigger fight start when complete
- **Disconnect Handling** — Clean up rooms and notify remaining player on disconnect

### Game Logic (`src/combat.js`)
- Pure functions for round resolution (rock-paper-scissors)
- Fully unit-tested with Vitest (14 tests, all passing)
- Reusable across server and client

## Project Structure

```
fightkiki/
├── README.md                 # This file
├── CLAUDE.md                 # Claude collaboration guidelines
├── package.json              # Project dependencies and scripts
├── vite.config.js            # Vite dev server + Socket.io proxy
├── index.html                # Entry point
│
├── server/
│   └── server.js             # Express + Socket.io backend
│
└── src/
    ├── main.js               # Phaser config + scene registration
    ├── TitleScene.js         # Title + Host/Join UI
    ├── NameScene.js          # Player name entry
    ├── SelectScene.js        # Move selection
    ├── FightScene.js         # Fight animation + scoring
    ├── ResultScene.js        # Results display
    ├── moves.js              # Move enum + metadata
    ├── combat.js             # Pure game logic
    └── combat.test.js        # Unit tests
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (frontend) on port 5173 |
| `npm run server` | Start Socket.io backend on port 3000 (auto-reloads with nodemon) |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Vitest unit tests |

## Features

✅ Local multiplayer via 4-digit room codes  
✅ Custom player names displayed throughout  
✅ Simultaneous move selection (no handoff screen needed)  
✅ Rock-paper-scissors balanced combat  
✅ Real-time animation and scoring  
✅ Mobile-responsive UI (portrait or landscape)  
✅ Graceful disconnect handling  
✅ Pure game logic extracted for testing  

## Development

### Tech Stack
- **Frontend**: Phaser 3, Vite, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Testing**: Vitest
- **Language**: ES Modules (native JS, no build transpilation)

### Design Principles
- Keep combat logic pure (testable, reusable)
- Move scene logic to Phaser (UI, animations)
- Use Socket.io for minimal, event-based networking
- No external art assets (all graphics drawn with Phaser)
- Prioritize learning over production robustness

## Testing

All 14 unit tests pass. Run with:
```bash
npm test
```

Tests cover:
- All 9 move combinations (win/loss/tie per matchup)
- Score computation for full 5-round matches
- Edge cases (all ties, all P1 wins, mixed sequences)

## Roadmap

Future enhancements (out of scope for MVP):
- [ ] Persistent leaderboards
- [ ] Multiple round matches (best-of-3, etc.)
- [ ] Ranked matchmaking
- [ ] Replay/spectate mode
- [ ] Sound effects and music
- [ ] Custom move sequences saved to localStorage

## License

ISC

---

Built by Jordi and Ferran as a learning project.
