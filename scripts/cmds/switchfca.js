const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

const FCA_LIST = {
  fca1: { name: "Sx69x FCA (Original)", stability: "high", antiban: "medium", speed: "fast", emoji: "⚡" },
  fca2: { name: "FCA Unofficial (Schmavery)", stability: "very high", antiban: "high", speed: "medium", emoji: "🛡️" },
  fca3: { name: "WS3 FCA (MQTT)", stability: "high", antiban: "medium", speed: "very fast", emoji: "🚀" },
  fca4: { name: "Rakib Custom FCA (Ghost Net)", stability: "high", antiban: "very high", speed: "slow", emoji: "👻" },
  fca5: { name: "Xaviabot FCA (Neokex)", stability: "high", antiban: "high", speed: "medium", emoji: "🦊" },
  fca6: { name: "KuRuMi FCA (EpicDanger198)", stability: "high", antiban: "medium", speed: "fast", emoji: "🌸" },
};

const ACTIVE_FILE = path.join(process.cwd(), "fca-modules", "active.json");

function getActive() {
  try { return (fs.readJsonSync(ACTIVE_FILE).active || "fca1").trim(); }
  catch(e) { return "fca1"; }
}

function setActive(name) {
  fs.ensureFileSync(ACTIVE_FILE);
  fs.writeJsonSync(ACTIVE_FILE, { active: name }, { spaces: 2 });
}

module.exports = {
  config: {
    name: "switchfca",
    aliases: ["fca", "fcaswitch", "setfca"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 2,
    shortDescription: "FCA switch করো (6 options)",
    longDescription: "6টি Facebook Chat API এর মধ্যে GC থেকেই switch করো",
    category: "owner",
    guide: "{pn} [fca1-fca6 | list | status]",
  },
  onStart: async function ({ api, event, args, message }) {
    const current = getActive();
    const input = (args[0] || "").toLowerCase().trim();

    if (!input || input === "list" || input === "status") {
      const lines = Object.entries(FCA_LIST).map(([key, info]) => {
        const active = key === current ? " ◄ ACTIVE" : "";
        return `${info.emoji} ${key}: ${info.name}${active}\n   Stability: ${info.stability} | Anti-ban: ${info.antiban} | Speed: ${info.speed}`;
      });
      return message.reply(
        `👻 𝗚𝗵𝗼𝘀𝘁 𝗕𝗼𝘁 — FCA Manager\n` +
        `━━━━━━━━━━━━━━━━━\n\n` +
        lines.join("\n\n") +
        `\n\n━━━━━━━━━━━━━━━━━\n` +
        `📌 Current: ${current} — ${FCA_LIST[current]?.name || "unknown"}\n\n` +
        `🔄 Switch করতে লিখো:\n` +
        `.switchfca fca1  (Default)\n` +
        `.switchfca fca4  (Rakib Anti-ban 👻)\n` +
        `.switchfca fca6  (KuRuMi 🌸)\n\n` +
        `⚠️ Switch এর পর .restart দিও!\n\n` +
        `👤 Owner: ${GHOST.ownerName}`
      );
    }

    if (!FCA_LIST[input]) {
      return message.reply(
        `❌ Invalid FCA: "${input}"\n\n` +
        `✅ Available: fca1, fca2, fca3, fca4, fca5, fca6\n\n` +
        `📋 List দেখতে: .switchfca list`
      );
    }

    if (input === current) {
      return message.reply(
        `ℹ️ Already using ${input}: ${FCA_LIST[input].name}\n\n` +
        `অন্য FCA switch করতে: .switchfca list`
      );
    }

    setActive(input);
    const info = FCA_LIST[input];

    return message.reply(
      `✅ FCA Switched!\n\n` +
      `${info.emoji} ${input}: ${info.name}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `📊 Stability: ${info.stability}\n` +
      `🛡️ Anti-ban: ${info.antiban}\n` +
      `⚡ Speed: ${info.speed}\n\n` +
      `⚠️ পরিবর্তন কার্যকর হতে bot restart করো:\n.restart\n\n` +
      `👻 Ghost Bot — ${GHOST.ownerName}`
    );
  }
};
