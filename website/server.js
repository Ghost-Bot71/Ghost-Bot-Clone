const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const app = express();
const PORT = process.env.WEBSITE_PORT || 3002;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const SETTINGS_PATH = path.join(process.cwd(), "data", "ghostSettings.json");
const BBY_QA_PATH = path.join(process.cwd(), "scripts/cmds/bbyLocalQA.json");
const ADMIN_SECRET = process.env.ADMIN_SECRET || "ghost8tap2026";

function getSettings() {
  try { return fs.readJsonSync(SETTINGS_PATH); } catch { return {}; }
}
function saveSettings(data) {
  fs.ensureDirSync(path.dirname(SETTINGS_PATH));
  fs.writeJsonSync(SETTINGS_PATH, data, { spaces: 2 });
}

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    bot: "Ghost Bot",
    owner: "Rakib Islam",
    uptime: Math.floor(process.uptime()),
    version: "Ghost Net Edition v2.0",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/bby-teach", (req, res) => {
  const { trigger, reply } = req.body;
  if (!trigger || !reply) return res.status(400).json({ error: "trigger and reply required" });
  const t = trigger.toLowerCase().trim();
  const r = reply.trim();
  if (t.length < 2 || r.length < 1) return res.status(400).json({ error: "too short" });
  try {
    const qa = fs.existsSync(BBY_QA_PATH) ? fs.readJsonSync(BBY_QA_PATH) : {};
    if (!qa[t]) qa[t] = [];
    if (!qa[t].includes(r)) qa[t].push(r);
    fs.ensureDirSync(path.dirname(BBY_QA_PATH));
    fs.writeJsonSync(BBY_QA_PATH, qa, { spaces: 2 });
    return res.json({ success: true, trigger: t, replies: qa[t] });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post("/api/admin/toggle", (req, res) => {
  const { secret, setting, threadID, value } = req.body;
  if (secret !== ADMIN_SECRET) return res.status(403).json({ error: "Invalid secret" });
  if (!setting) return res.status(400).json({ error: "setting required" });
  try {
    const s = getSettings();
    const tid = threadID || "global";
    if (!s[tid]) s[tid] = { silentMode: false, silentWhitelist: [], bbyEnabled: true, stickerReply: true };
    s[tid][setting] = value !== undefined ? value : !s[tid][setting];
    saveSettings(s);
    return res.json({ success: true, [setting]: s[tid][setting] });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.get("/api/admin/settings", (req, res) => {
  const { secret, threadID } = req.query;
  if (secret !== ADMIN_SECRET) return res.status(403).json({ error: "Invalid secret" });
  const s = getSettings();
  const tid = threadID || "global";
  res.json(s[tid] || { silentMode: false, bbyEnabled: true, stickerReply: true });
});

app.listen(PORT, () => {
  console.log(`\x1b[36m👻 Ghost Bot Website running on port ${PORT}\x1b[0m`);
});
