# 🤖 MASTER PROMPT — RAKIB GHOST BOT v2 (Prime Fork)
## নতুন Replit project এ এই পুরো prompt টা paste করো

---

## 📌 PROJECT OVERVIEW

আমি একটি Facebook Messenger Bot বানাতে চাই। Base হবে এই GitHub repo:
**https://github.com/ShifuX69/Prime-GoatBot**

এটা GoatBot V2 এর একটি fork। আমি এই repo টা clone করে আমার নিজের নামে সম্পূর্ণ customize করব।

---

## 👤 OWNER INFORMATION (সব জায়গায় এই info ব্যবহার করতে হবে)

```
ownerName    : Rakib Islam
ownerUID     : 61575436812912
botName      : Ghost Bot
prefix       : .
location     : Saidpur, Nilphamari
status       : Single 💔
religion     : Islam ☪️
class        : Secret 🔒
job          : Student 📚
hobby        : Gaming & Travelling 🎮
facebook     : fb.com/profile.php?id=61575436812912
timeZone     : Asia/Dhaka
botEdition   : Ghost Net Edition
```

---

## 📁 STEP 1 — REPO CLONE করো

```bash
git clone https://github.com/ShifuX69/Prime-GoatBot.git prime-ghost-bot
cd prime-ghost-bot
```

Workspace folder: `/home/runner/workspace/prime-ghost-bot/`

---

## ⚙️ STEP 2 — REPLIT SETUP (`.replit` এবং workflow)

`.replit` file এ এটা থাকতে হবে:

```toml
run = "node index.js"
entrypoint = "index.js"

[nix]
channel = "stable-24_05"

[[ports]]
localPort = 3001
externalPort = 80
```

`replit.nix` file:
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.python3
    pkgs.ffmpeg
    pkgs.imagemagick
    pkgs.chromium
    pkgs.canvas
  ];
}
```

Replit workflow তৈরি করো: **"Start Bot"** নামে, command: `node index.js`

---

## 📦 STEP 3 — PACKAGE.JSON FIX

`package.json` এ এগুলো থাকতে হবে:
```json
{
  "name": "prime-ghost-bot",
  "version": "2.0.0",
  "description": "Ghost Bot — Rakib Islam Edition",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "engines": {
    "node": "20.x"
  }
}
```

Dependencies install:
```bash
npm install
```

যদি canvas বা sharp error দেয়:
```bash
npm install canvas --build-from-source
npm install sharp
```

---

## 🔧 STEP 4 — CONFIG.JSON CUSTOMIZE

`config.json` এ এই পরিবর্তন করতে হবে:

```json
{
  "adminBot": ["61575436812912"],
  "developer": ["61575436812912"],
  "vipuser": ["61575436812912"],
  "nickNameBot": "Ghost Bot 👻",
  "prefix": ".",
  "timeZone": "Asia/Dhaka",
  "database": {
    "type": "sqlite"
  },
  "autoRefreshFbstate": true,
  "optionsFca": {
    "forceLogin": true,
    "listenEvents": true,
    "autoReconnect": true,
    "online": true,
    "logLevel": "error"
  }
}
```

---

## 🔑 STEP 5 — FCA (Facebook Chat API) MODIFY

Bot এর FCA library modify করতে হবে যাতে stable থাকে।

`node_modules/@xaviabot/fca-unofficial/index.js` অথবা যেখানে FCA আছে সেখানে:

**Rate limit fix** — FCA এর `sendMessage` function এ এই wrapper যোগ করো:
```javascript
// Rate limit protection
const _originalSendMessage = api.sendMessage.bind(api);
let _lastSend = 0;
api.sendMessage = function(msg, threadID, callback, messageID) {
  const now = Date.now();
  const diff = now - _lastSend;
  const delay = diff < 1000 ? 1000 - diff : 0;
  _lastSend = now + delay;
  setTimeout(() => {
    _originalSendMessage(msg, threadID, callback, messageID);
  }, delay);
};
```

**fbstate.json** — Cookie file। Replit Secret এ রাখো:
- Secret name: `FBSTATE` (JSON string হিসেবে)
- `index.js` বা `Sakura.js` এ পড়ার সময়:
```javascript
const fbstate = JSON.parse(process.env.FBSTATE || fs.readFileSync("fbstate.json", "utf8"));
```

---

## 🔄 STEP 6 — INDEX.JS / SAKURA.JS FIX

**Bot restart fix** — `index.js` এ:
```javascript
const { spawn } = require("child_process");

function startBot() {
  const bot = spawn("node", ["Sakura.js"], { stdio: "inherit" });
  
  bot.on("exit", (code) => {
    console.log(`Bot exited with code ${code}`);
    if (code === 2) {
      console.log("Restarting bot in 3 seconds...");
      setTimeout(startBot, 3000);
    } else {
      console.log("Bot stopped. Not restarting.");
    }
  });
}

startBot();
```

**restart.js** command এ:
```javascript
process.exit(2); // এটা দিলেই index.js restart করবে
```

---

## 🌐 STEP 7 — RENDER DEPLOY FIX

Render এ deploy করতে হলে:

**render.yaml** file:
```yaml
services:
  - type: web
    name: prime-ghost-bot
    env: node
    buildCommand: npm install
    startCommand: node index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: FBSTATE
        sync: false
    healthCheckPath: /
```

**Express server** যোগ করো `index.js` বা আলাদা `server.js` এ:
```javascript
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => res.send("Ghost Bot is running! 👻"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**Uptime Robot** দিয়ে bot alive রাখো:
- URL: `https://your-render-url.onrender.com/`
- Interval: 5 minutes

---

## ⚡ STEP 8 — GITHUB ACTIONS WORKFLOW

`.github/workflows/deploy.yml` file:
```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm install
        
      - name: Deploy to Render
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"serviceId": "${{ secrets.RENDER_SERVICE_ID }}"}' \
            https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys
```

GitHub Secrets এ যোগ করো:
- `RENDER_API_KEY` — Render dashboard থেকে
- `RENDER_SERVICE_ID` — Render service ID

---

## 🤖 STEP 9 — COMMANDS (সব command এ author: "Rakib Islam" দিতে হবে)

### 📌 GHOST CONFIG FILE

`ghostConfig.json` (root এ):
```json
{
  "ownerUID": "61575436812912",
  "ownerName": "Rakib Islam",
  "botName": "Ghost Bot",
  "botEdition": "Ghost Net Edition",
  "prefix": ".",
  "location": "Saidpur, Nilphamari",
  "status": "Single 💔",
  "religion": "Islam ☪️",
  "job": "Student 📚",
  "hobby": "Gaming & Travelling 🎮",
  "facebook": "fb.com/profile.php?id=61575436812912"
}
```

---

### 🛠️ COMMAND LIST (300 commands এর জন্য categories)

নিচের categories তে commands বানাতে হবে। প্রতিটি command এ:
- `author: "Rakib Islam"`
- বাংলা guide/description
- "Ghost Net Edition" footer
- নিচের owner info থেকে নাম/location নেবে

#### 📂 Category: INFO (10 commands)
1. `owner` — Animated GIF card, neon style, owner এর Facebook PFP সহ
2. `owner1` — VIP Gold style owner card  
3. `owner2` — Neon Throne style
4. `owner3` — Cyberpunk style
5. `botinfo` — Bot এর সম্পূর্ণ তথ্য (uptime, prefix, owner, commands count)
6. `ghostinfo` — Ghost Net edition special info card
7. `help` — সব command list, category অনুযায়ী
8. `prefix` — current prefix দেখাবে
9. `ping` — Bot latency check
10. `uptime` — Bot কতক্ষণ চলছে

#### 📂 Category: SPY (8 commands)
11. `spy` — User এর FB profile info (name, UID, avatar)
12. `spy2` — Thread/Group info (member count, name, admin list)
13. `spy3` — User এর active time guess
14. `spy4` — UID থেকে profile picture আনবে
15. `spy5` — Group member list
16. `spy6` — Check if user is admin
17. `spy7` — Bot নিজের info
18. `uid` — Message reply দিলে UID বের করে দেবে

#### 📂 Category: HACK/PRANK (8 commands)
19. `hacker` — Fake hack prank (loop/stop/unsend mode)
20. `hacker2` — Alternative hack lines
21. `hack` — Short version
22. `hack2`, `hack3`, `hack4`, `hack5` — Different styles
23. `toxic` — Roast loop
24. `xdmu` — 100 gali loop + notification bomb

#### 📂 Category: FUN (20 commands)
25. `fight` — Bengali auto fight HP bar
26. `flirt` — Single flirt line
27. `flirt2` — Auto flirt loop (3000ms interval — NO 500ms)
28. `spam` — Spam command (2500ms delay — safe interval)
29. `dare` — Truth or dare
30. `dare2` — Alternative dares
31. `truth` — Truth questions
32. `truth2` — Alternative truths
33. `roast` — Roast someone
34. `bdroast` — Bangla roast
35. `compliment` — Compliment someone
36. `propose` — Propose to someone
37. `marry` — Marry command
38. `divorce` — Divorce command
39. `breakup` — Breakup message
40. `couple` — Couple card with PFPs
41. `pair` — Pair two people
42. `ship` — Ship percentage
43. `simp` — Simp meter
44. `howgay` — How gay meter (fun)

#### 📂 Category: AI (Free APIs — 15 commands)
45. `ask` / `gpt` — **Pollinations AI** (free, no key): `https://text.pollinations.ai/{prompt}`
46. `gemini` — **Google Gemini** (free tier): `generativelanguage.googleapis.com`
47. `imagine` / `texttoimage` — **Pollinations Image** (free): `https://image.pollinations.ai/prompt/{prompt}`
48. `ghostask` — Custom personality AI (Ghost Bot persona দিয়ে)
49. `codeai` / `ghostcodeai` — Code generation AI
50. `translate` — Free translation (MyMemory API — no key)
51. `define` — Word definition (Free Dictionary API — no key)
52. `wiki` — Wikipedia summary (MediaWiki API — no key)
53. `weather` — Weather (OpenWeatherMap free tier)
54. `news` — Latest news (GNews free tier)
55. `quote` — Random quotes (quotable.io — no key)
56. `joke` — Jokes (official-joke-api — no key)
57. `fact` — Random facts (uselessfacts API — no key)
58. `horoscope` — Zodiac horoscope (aztro API)
59. `riddle` — Random riddle (riddles API — no key)

#### 📂 Category: IMAGE (15 commands)
60. `pfp` — User profile picture download
61. `avatar` — Animated avatar card
62. `edit` — Image editing (filter, blur, grayscale)
63. `gray` — Grayscale image
64. `blur` — Blur image
65. `mirror` — Mirror image
66. `triggered` — Triggered GIF
67. `wasted` — Wasted GTA style
68. `jail` — Jail bars overlay
69. `wanted` — Wanted poster
70. `drake` — Drake meme template
71. `fakechat` — Fake chat screenshot generator
72. `fakeid` — Fake ID card (fun)
73. `neoncard` — Neon profile card
74. `couple` — Couple image merge

#### 📂 Category: MEDIA (10 commands)
75. `song` — YouTube থেকে MP3 download
76. `video` — YouTube video download
77. `ytb` — YouTube search
78. `lyrics` — Song lyrics
79. `spotify` — Spotify track info
80. `tiktok` — TikTok video download
81. `fbdl` — Facebook video download
82. `alldl` — Universal media downloader
83. `sing` — Text to speech song
84. `gif` — Search GIF

#### 📂 Category: GAME (10 commands)
85. `tictactoe` / `ttt` — Tic-tac-toe game
86. `hangman` — Hangman game
87. `quiz` — Random quiz
88. `bdquiz` — Bangladesh quiz
89. `animequiz` — Anime quiz
90. `guess` — Guess the number
91. `dice` — Roll dice
92. `coinflip` — Coin flip
93. `rps` — Rock paper scissors
94. `wordchain` — Word chain game

#### 📂 Category: ADMIN (15 commands)
95. `kick` — Kick user from group
96. `ban` — Ban user from bot
97. `warn` — Warn user
98. `ghostwarn` — Custom warn system
99. `unban` — Unban user
100. `adduser` — Add user to group
101. `makeadmin` — Make admin
102. `gcname` — Change group name
103. `gctheme` — Change group theme
104. `boxinfo` — Group info
105. `antilink` — Anti-link protection
106. `antispam` — Anti-spam protection
107. `welcome` — Welcome new members (4s delay for bulk)
108. `leave` — Leave message
109. `gcmd` — Per-group command enable/disable

#### 📂 Category: OWNER ONLY (10 commands)
110. `restart` — Restart bot (exit code 2)
111. `ghostban` — Ban a group/user
112. `broadcast` — Send message to all groups
113. `ghostbroadcast` — Styled broadcast
114. `eval` — Execute JavaScript code
115. `shell` — Execute shell command
116. `loadcmd` — Load new command
117. `ghostcmd` — Create custom command
118. `gcmd` — Group command control
119. `update` — Check for updates

#### 📂 Category: BANGLA (15 commands)
120. `bdjoker` — Bangla jokes
121. `bdquote` — Bangla quotes
122. `bdshayari` — Bangla shayari
123. `bdfriend` — Friendship quotes
124. `bdwish` — Wishes (birthday, eid, etc.)
125. `bdhistory` — Bangladesh history
126. `bdhadith` — Islamic hadith
127. `islamquote` — Islamic quotes
128. `dua` — Islamic dua
129. `bdflirt` — Bangla flirt lines
130. `bdstatus` — Bangla Facebook status
131. `bdsuccess` — Success quotes
132. `bdmovie` — Bangla movie info
133. `bdcaption` — Bangla photo captions
134. `bdfact` — Bangladesh facts

#### 📂 Category: UTILITY (20 commands)
135. `calc` / `calculator` — Calculator
136. `currency` — Currency converter (free API)
137. `qr` / `qrcode` — QR code generator
138. `shorturl` — URL shortener
139. `ipinfo` — IP information
140. `domaininfo` — Domain info
141. `phoneinfo` — Phone number info
142. `binary` — Text to binary
143. `morse` — Morse code
144. `encrypt` — Text encryption
145. `passgen` — Password generator
146. `bmi` — BMI calculator
147. `age` — Age calculator
148. `time` — Current time (Asia/Dhaka)
149. `calendar` — Calendar
150. `remind` — Set reminder
151. `poll` — Create poll
152. `choose` — Choose from options
153. `count` — Count members
154. `note` — Save notes

#### 📂 Category: ECONOMY (10 commands) 
155. `daily` — Daily coins
156. `balance` — Check balance
157. `bank` — Bank system
158. `loan` — Loan system
159. `pay` — Transfer coins
160. `rank` — User rank
161. `top` — Top users leaderboard
162. `slot` — Slot machine
163. `lottery` — Lottery
164. `lucky` — Lucky number

#### 📂 Category: SOCIAL (10 commands)
165. `hug` — Hug someone (anime GIF)
166. `kiss` — Kiss someone
167. `slap` — Slap someone
168. `pat` — Pat someone
169. `cuddle` — Cuddle
170. `poke` — Poke someone
171. `bonk` — Bonk someone
172. `wink` — Wink at someone
173. `love` — Love someone
174. `confession` — Anonymous confession

#### 📂 Category: MISC (rest up to ~300)
- `alive` — Bot alive check with styled message
- `say` — Bot বলবে
- `repeat` — Message repeat
- `pin` — Pin message
- `notification` — Send notification
- `ratio` — Ratio someone
- `sus` — Among us sus
- `zalgo` — Zalgo text
- `smallcaps` — Small caps text
- `vaporwave` — Vaporwave text
- `striketext` — Strikethrough text
- `superscript` — Superscript text
- `widetext` — Wide text
- `aesthetic` — Aesthetic text
- `font` — Different fonts
- `emoji_voice` — Emoji to voice
- `emojify` — Text to emoji
- `emojimean` — Emoji meaning
- `sentiment` — Message sentiment analysis
- `wordcount` — Word count
- `palindrome` — Palindrome check
- `scramble` — Scramble game
- `anagram` — Anagram
- `trivia` — Trivia questions
- `eightball` — 8 ball
- `magic8` — Magic 8 ball
- `goodmorning` — Good morning message
- `goodnight` — Good night message
- `birthday` — Birthday wish with card
- `eid` — Eid wish
- `newyr` — New year wish
- `vday` — Valentine's day
- এবং আরো...

---

## 🔑 STEP 10 — FREE AI APIs (কোনো API key লাগবে না)

### ১. Pollinations AI (Text — সম্পূর্ণ ফ্রি, key নেই)
```javascript
const axios = require("axios");
async function askAI(prompt) {
  const res = await axios.get(
    `https://text.pollinations.ai/${encodeURIComponent(prompt)}`,
    { timeout: 30000 }
  );
  return res.data;
}
```

### ২. Pollinations Image (Image — সম্পূর্ণ ফ্রি, key নেই)
```javascript
async function generateImage(prompt) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 60000 });
  return Buffer.from(res.data);
}
```

### ৩. MyMemory Translation (ফ্রি, key নেই)
```javascript
async function translate(text, to = "bn") {
  const res = await axios.get(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${to}`
  );
  return res.data.responseData.translatedText;
}
```

### ৪. Free Dictionary API
```javascript
async function define(word) {
  const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  return res.data[0]?.meanings[0]?.definitions[0]?.definition || "Not found";
}
```

### ৫. Wikipedia API
```javascript
async function wiki(query) {
  const res = await axios.get(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
  );
  return res.data.extract || "Not found";
}
```

### ৬. JokeAPI (ফ্রি)
```javascript
async function getJoke() {
  const res = await axios.get("https://v2.jokeapi.dev/joke/Any?blacklistFlags=racist,sexist");
  return res.data.type === "twopart" 
    ? `${res.data.setup}\n\n${res.data.delivery}`
    : res.data.joke;
}
```

### ৭. Quotable (ফ্রি)
```javascript
async function getQuote() {
  const res = await axios.get("https://api.quotable.io/random");
  return `"${res.data.content}"\n— ${res.data.author}`;
}
```

---

## 🛡️ STEP 11 — ANTI-SPAM / RATE LIMIT PROTECTION

সব loop commands এ এই rules follow করতে হবে:

```
setInterval delay    : minimum 3000ms (3 seconds)
Welcome bulk delay   : 4000ms per user (sequential, না simultaneous)
Spam command delay   : 2500ms per message
Hacker/Toxic loop    : 2000ms minimum
XDMU normal mode     : 2500ms
Notification bomb    : 600-900ms (instant unsend, তাই ঠিক আছে)
```

**Rule:** কোনো loop command এ 1000ms এর নিচে interval রাখা যাবে না।

---

## 🗂️ STEP 12 — IMPORTANT FILES STRUCTURE

```
prime-ghost-bot/
├── index.js              ← Bot main entry, restart logic (exit code 2)
├── Sakura.js             ← Bot core
├── config.json           ← Main config (adminBot, prefix, timezone)
├── ghostConfig.json      ← Owner info (Rakib Islam)
├── fbstate.json          ← Facebook cookies (GITIGNORE THIS)
├── package.json          ← Dependencies
├── .replit               ← Replit config
├── replit.nix            ← Nix packages
├── .gitignore            ← fbstate.json, node_modules, cache
├── .github/
│   └── workflows/
│       └── deploy.yml    ← GitHub Actions
├── render.yaml           ← Render deploy config
├── scripts/
│   ├── cmds/             ← All commands (.js files)
│   └── events/           ← Event listeners
│       ├── welcome.js    ← 4s delay for bulk join
│       ├── leave.js
│       └── autolearn.js
└── node_modules/
```

---

## 🚫 STEP 13 — GITIGNORE

`.gitignore` file:
```
node_modules/
fbstate.json
*.log
scripts/cmds/cache/
scripts/events/cache/
scripts/events/tmp/
.env
ghostCustomCmds/
```

---

## ✅ STEP 14 — CHECKLIST (প্রতিটি কাজ শেষে check করো)

- [ ] Repo clone করা হয়েছে
- [ ] `config.json` এ owner UID `61575436812912` দেওয়া হয়েছে
- [ ] `ghostConfig.json` বানানো হয়েছে (Rakib Islam info)
- [ ] `.replit` এবং `replit.nix` সেটআপ করা হয়েছে
- [ ] `index.js` এ restart logic ঠিক আছে (exit code 2)
- [ ] `restart.js` command এ `process.exit(2)` দেওয়া হয়েছে
- [ ] FCA rate limit wrapper যোগ করা হয়েছে
- [ ] `welcome.js` এ 4s delay দেওয়া হয়েছে
- [ ] সব loop commands এ 3000ms+ interval
- [ ] `galireply.js` বা যেকোনো angry emoji auto-react feature নেই
- [ ] AI commands এ Pollinations API ব্যবহার করা হয়েছে (free, no key)
- [ ] `render.yaml` বানানো হয়েছে
- [ ] GitHub Actions workflow বানানো হয়েছে
- [ ] `fbstate.json` `.gitignore` এ আছে
- [ ] প্রতিটি command এ `author: "Rakib Islam"` আছে
- [ ] Bot test করা হয়েছে: `.ping`, `.owner`, `.help`

---

## 🚀 STEP 15 — COMMANDS এ OWNER INFO AUTO-LOAD

প্রতিটি command এ manually info না লিখে `ghostConfig.json` থেকে load করো:

```javascript
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

// তারপর ব্যবহার করো:
// GHOST.ownerName   → "Rakib Islam"
// GHOST.ownerUID    → "61575436812912"
// GHOST.botName     → "Ghost Bot"
// GHOST.location    → "Saidpur, Nilphamari"
// GHOST.prefix      → "."
```

এতে একবার `ghostConfig.json` update করলেই সব command এ change হয়ে যাবে।

---

## ⚠️ IMPORTANT RULES (কখনো ভুলবে না)

1. **কোনো command এ 500ms বা 1000ms interval রাখবে না** — Facebook ban করবে
2. **welcome.js** তে একসাথে 50 জন join হলে **sequential delay** দিতে হবে
3. **restart command** এ সবসময় `process.exit(2)` — কখনো `exit(1)` না
4. **fbstate.json** কখনো GitHub এ push করবে না
5. **galireply.js** type angry emoji auto-react feature রাখবে না
6. **FCA** modify করার আগে backup নাও
7. **Render** এ deploy করার পর Uptime Robot দিয়ে alive রাখো
8. **Replit** এ run করার সময় workflow দিয়ে চালাও, manually না

---

## 📞 SESSION START INSTRUCTION

নতুন Replit project এ কাজ শুরু করার সময় agent কে বলো:

> "এই master prompt অনুযায়ী কাজ করো। প্রথমে https://github.com/ShifuX69/Prime-GoatBot clone করো workspace এ। তারপর step by step সব করো। Owner: Rakib Islam, UID: 61575436812912, Location: Saidpur Nilphamari, Bot: Ghost Bot."
