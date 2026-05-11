# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

---

# Ghost Bot — Ghost Net Edition

Cloned from https://github.com/explainrhk/Anime-Voice-Bot.git into `/ghost-bot/`.

## How to Run Ghost Bot

```
cd ghost-bot && node index.js
```

The website (BBY guide + owner portfolio) is served at port 3001.

## What was changed

- **Author lock removed** — all 44+ cmd files that had `String.fromCharCode(77,97,104,77,85,68)` author checks are fixed. 0 remaining.
- **All cmd files** — author set to "Rakib Islam"
- **Startup banner** — changed from GOAT BOT V2 to Ghost Bot in login.js and index.js
- **Bash title** — changed from "Goat Bot V2 - Fca By Mahi68x" to "Ghost Bot - Owner: Rakib Islam"
- **FCA anti-detection** — rotating user agents (Android/iOS mobile), added Accept-Language, Accept-Encoding, Cache-Control headers
- **sendMessage rate-limit fix** — error 1390008 now triggers a 15s cooldown + retry instead of massive verbose dump
- **BBY command** — enhanced with `.bby howto` tutorial command, better error messages, improved teach confirmation
- **GitHub workflow** — updated to install canvas/cairo system deps, load FBSTATE from secret, run on push
- **Website** — `/ghost-bot/website/index.html` — BBY teaching guide + owner portfolio for Rakib Islam

## User preferences

- Bot name: Ghost Bot
- Owner: Rakib Islam (Facebook ID: 61575436812912)
- Prefix: .
- Edition: Ghost Net Edition
