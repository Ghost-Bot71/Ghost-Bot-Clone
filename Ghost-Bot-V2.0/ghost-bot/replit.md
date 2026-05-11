# Ghost Bot — Ghost Net Edition

A Facebook Messenger Bot built on GoatBot V2 by **Rakib Islam**. Merged Prime-GoatBot and MAMUN V2 repos with 325+ commands, 21 Hugging Face AI commands, anime girl voice, and dual FCA switch system.

## Run & Operate

- **Start Bot**: Run the `Ghost Bot` workflow (set `account.txt` or `FBSTATE` secret first)
- `node index.js` — direct start (spawns Goat.js → login.js)
- `pnpm --filter @workspace/api-server run dev` — workspace API server (port 5000)

## Stack

- Node.js 24, Facebook Chat API (fca-unofficial / axios-cookiejar)
- GoatBot V2 fork (Prime-GoatBot + MAMUN V2 merged)
- Hugging Face Inference API (`HF_TOKEN` secret)
- Express (for dashboard if enabled)
- pnpm workspaces monorepo (bot lives at root)

## Where things live

- `index.js` — entry point, Ghost Bot banner + restart logic
- `Goat.js` — main bot bootstrap (Gmail optional, version check optional)
- `bot/login/login.js` — FB login, FBSTATE loader, GBAN/notification bypass
- `bot/fcaSwitch.js` — dual FCA switch system
- `config.json` — bot config (prefix ".", adminBot, fcaMode)
- `ghostConfig.json` — owner info (Rakib Islam)
- `account.txt` — FB cookies JSON (set `[]` if using FBSTATE env var)
- `scripts/cmds/` — 325+ commands including 21 HF commands
- `scripts/cmds/animegirl.js` — anime girl voice (HF TTS)
- `scripts/cmds/switchfca.js` — dual FCA switch command
- `scripts/cmds/hf*.js` — 20 Hugging Face AI commands
- `scripts/events/` — event handlers

## HF Commands (21 total)

`hfask`, `hfimage`, `hftranslate`, `hfsentiment`, `hfsummarize`, `hfcode`, `hfqa`, `hfclassify`, `hftts` (animegirl), `hfcaption`, `hfstory`, `hflyrics`, `hfanime`, `hfchat`, `hfface`, `hfpoem`, `hfbangla`, `hfroast`, `hfadvice`, `hfdebug`, `animegirl`

## Architecture decisions

- Bot lives at workspace root alongside pnpm monorepo artifacts — intentional coexistence
- Gmail OAuth is optional (bot continues without it)
- Version check, GBAN, and notification fetches are bypassed with warnings (stability)
- `process.exit()` calls replaced with `log.warn()` + continue wherever safe
- HF_TOKEN loaded from Replit secret `process.env.HF_TOKEN`
- FBSTATE can be set as env var — auto-written to `account.txt` on startup

## Product

Ghost Net Edition Messenger Bot for Facebook with 325+ commands, AI features via Hugging Face, anime voice, image manipulation, games, utilities, and dual FCA login switching.

## User preferences

- Bot name: Ghost Bot, owner: Rakib Islam
- Prefix: `.`
- Admin UID: 61575436812912
- All HF commands use `process.env.HF_TOKEN` (Replit secret)
- Bot should NOT crash on version/GBAN/notification network errors

## Gotchas

- Set `account.txt` to valid FB cookies JSON OR set `FBSTATE` env secret before starting
- `canvas` npm package removed (requires native build tools) — canvas commands will error gracefully
- Run `cd /home/runner/workspace && npm install` if node_modules missing
- Bot workflow: `Ghost Bot` → `cd /home/runner/workspace && node index.js`

## Pointers

- See the `pnpm-workspace` skill for workspace structure
- GoatBot V2 original: https://github.com/ntkhang03/Goat-Bot-V2
