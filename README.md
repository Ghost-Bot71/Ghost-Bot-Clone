<div align="center">

# 👻 Ghost Bot — Ghost Net Edition

**Facebook Messenger Bot** built on GoatBot V2 by **Rakib Islam**

[![Node.js](https://img.shields.io/badge/Node.js-24-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Platform](https://img.shields.io/badge/Platform-Facebook_Messenger-blue?style=for-the-badge&logo=messenger)](https://messenger.com)
[![Commands](https://img.shields.io/badge/Commands-325+-purple?style=for-the-badge)](https://github.com)
[![AI](https://img.shields.io/badge/HuggingFace-21_AI_Commands-orange?style=for-the-badge&logo=huggingface)](https://huggingface.co)
[![Author](https://img.shields.io/badge/Owner-Rakib_Islam-red?style=for-the-badge)](https://github.com)

</div>

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🤖 **Commands** | 325+ commands including games, AI, music, anime, utilities |
| 🧠 **AI (HuggingFace)** | 21 AI commands — chat, image gen, TTS, sentiment, translate |
| 💬 **BBY System** | Teachable chat bot — anyone can train it with `.bby teach` |
| 🎭 **Anime Features** | Waifu, neko, anime girl voice (TTS), wholesome, slap, hug |
| 🔇 **Silent Mode** | Per-group silent mode with admin/whitelist control |
| 🎯 **Auto Sticker** | Auto-replies to stickers & GIFs with random stickers |
| 🚢 **Fun Commands** | Ship, Hack (fake), Facts, Jokes, Password generator |
| 🛡️ **Group Tools** | Anti-spam, admin tools, role system, ban/unban |
| 🎵 **Media** | YouTube search, Spotify, TikTok download, image gen |
| ⚙️ **Dual FCA** | Switchable Facebook Chat API (fca1 — Sx69x Original) |

---

## 🚀 Quick Start

### 1. Prerequisites
```bash
node --version  # Needs Node.js 18+
npm --version
```

### 2. Clone & Install
```bash
git clone <your-repo-url>
cd ghost-bot
npm install
```

### 3. Set Credentials
Either set `account.txt` with your FB cookies JSON:
```json
[{"key":"c_user","value":"YOUR_UID","domain":".facebook.com",...}]
```
Or set the `FBSTATE` environment variable (Replit secret).

### 4. Run
```bash
node index.js
```

---

## 🔧 Environment Variables / Secrets

| Variable | Required | Description |
|----------|----------|-------------|
| `FBSTATE` | Optional | FB cookies JSON (if not using account.txt) |
| `HF_TOKEN` | Optional | HuggingFace API token for 21 AI commands |
| `SESSION_SECRET` | Optional | Session secret for web dashboard |
| `ADMIN_SECRET` | Optional | Admin panel password (default: `ghost8tap2026`) |

---

## 📋 Commands Reference

### 🤖 AI Commands (HuggingFace)
| Command | Description |
|---------|-------------|
| `.hfask [question]` | Ask anything — AI answers |
| `.hfimage [prompt]` | Generate AI image |
| `.hftranslate [text]` | Translate to English |
| `.hfsentiment [text]` | Analyze sentiment |
| `.hfsummarize [text]` | Summarize text |
| `.hfcode [question]` | Code help |
| `.hftts [text]` | Text to speech |
| `.hfroast [name]` | AI roast (funny!) |
| `.hfpoem [topic]` | Write a poem |
| `.hfstory [topic]` | Generate story |
| `.animegirl [text]` | Anime girl voice TTS |

### 💬 BBY Chat System
| Command | Description |
|---------|-------------|
| `.bby [message]` | Chat with bot |
| `.bby teach [msg] - [reply]` | Teach bot a reply |
| `.bby teach react [msg] - [emoji]` | Teach emoji reaction |
| `.bby edit [msg] - [new reply]` | Edit a taught reply |
| `.bby remove [msg]` | Remove taught replies |
| `.bby list` | See teach stats |
| `.bby on / .bby off` | Enable/disable bby per group |

### 🎭 Fun & Anime
| Command | Description |
|---------|-------------|
| `.waifu [category]` | Random anime waifu/GIF |
| `.ship @user1 @user2` | Love compatibility % |
| `.slap @user` | Slap someone (canvas image) |
| `.wholesome @user` | Wholesome avatar image |
| `.hack @user` | Fake hack animation |
| `.fact [bn/en]` | Random interesting fact |
| `.joke [bn/en]` | Random joke |
| `.password [length]` | Secure password generator |

### 🔇 Group Management
| Command | Description |
|---------|-------------|
| `.silent on/off` | Bot silent mode (admin only) |
| `.silent add @user` | Add to whitelist |
| `.sticker on/off` | Auto sticker reply toggle |
| `.ban @user` | Ban user from bot |
| `.unban @user` | Unban user |
| `.prefix [symbol]` | Change bot prefix |

### 🎵 Media
| Command | Description |
|---------|-------------|
| `.ytbsearch [query]` | YouTube search |
| `.spotify [query]` | Spotify track info |
| `.tiktok [url]` | TikTok download |
| `.pinterest [query]` | Pinterest image search |

---

## 📁 Project Structure

```
ghost-bot/
├── index.js              # Entry point — Ghost Bot banner + restart logic
├── Goat.js               # Main bot bootstrap
├── config.json           # Bot config (prefix, admin, etc.)
├── ghostConfig.json      # Owner info
├── account.txt           # FB cookies (slot 1)
├── fca-modules/          # FCA modules (fca1 — Sx69x Original)
│   └── active.json       # Currently active FCA
├── bot/
│   ├── login/login.js    # FB login + multi-account support
│   ├── handler/          # Message handlers (command routing)
│   └── fcaSwitch.js      # FCA switcher
├── scripts/
│   ├── cmds/             # 325+ command files
│   └── events/           # Event handlers
├── data/
│   └── ghostSettings.json # Per-thread settings (silent, bby, sticker)
└── website/              # Bot info website
    ├── index.html        # Main website (with admin panel)
    └── server.js         # Express server + API
```

---

## ⚙️ Configuration

### config.json
```json
{
  "prefix": ".",
  "adminBot": ["61575436812912"],
  "language": "en",
  "fcaMode": "fca1"
}
```

### ghostConfig.json
```json
{
  "ownerName": "Rakib Islam",
  "ownerUID": "61575436812912",
  "botName": "Ghost Bot",
  "version": "2.0"
}
```

---

## 🌐 Admin Panel

The bot website has a **secret admin panel** — tap the Ghost Bot logo **8 times** to reveal it.

The admin panel lets you:
- View bot status (online/offline/uptime)
- Toggle BBY mode per thread
- Toggle Sticker auto-reply
- Toggle Silent mode
- Teach BBY from the website (no Messenger needed!)

**Default admin secret:** `ghost8tap2026` (set `ADMIN_SECRET` env var to change)

---

## 🔄 FCA System

Currently only **fca1 (Sx69x Original)** is active.

| FCA | Name | Notes |
|-----|------|-------|
| fca1 | Sx69x Original | ✅ Active — default, stable |

Switch using: `.switchfca fca1`
Always run `.restart` after switching!

---

## 👤 Owner

**Rakib Islam**
- Bot: Ghost Bot — Ghost Net Edition
- Admin UID: `61575436812912`
- Prefix: `.`
- Stack: Node.js 24, GoatBot V2, HuggingFace AI

---

<div align="center">

**👻 Ghost Bot — Ghost Net Edition**
Built with ❤️ by **Rakib Islam**

</div>
