const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "ghostinfo", aliases: ["ghost", "gi"],
    version: "1.0", author: "Rakib Islam", countDown: 3, role: 0,
    shortDescription: "Ghost Bot info দেখো", longDescription: "Ghost Net Edition এর সম্পূর্ণ bot info দেখো",
    category: "info", guide: "{pn}",
  },
  onStart: async function ({ message, api }) {
    const uptime = process.uptime();
    const h = Math.floor(uptime/3600), m = Math.floor((uptime%3600)/60), s = Math.floor(uptime%60);
    const totalCmds = require("fs").readdirSync(path.join(__dirname)).filter(f=>f.endsWith(".js")).length;
    return message.reply(
      `👻 ━━━━━━━━━━━━━━━━━━━━━ 👻\n` +
      `  𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 — Ghost Net Edition\n` +
      `👻 ━━━━━━━━━━━━━━━━━━━━━ 👻\n\n` +
      `👤 Owner: ${GHOST.ownerName}\n` +
      `📍 Location: ${GHOST.location}\n` +
      `💼 Job: ${GHOST.job}\n` +
      `🎮 Hobby: ${GHOST.hobby}\n` +
      `💔 Status: ${GHOST.status}\n` +
      `☪️ Religion: ${GHOST.religion}\n` +
      `🔗 FB: ${GHOST.facebook}\n\n` +
      `🤖 Bot Name: ${GHOST.botName}\n` +
      `📌 Prefix: ${GHOST.prefix}\n` +
      `⏱️ Uptime: ${h}h ${m}m ${s}s\n` +
      `💻 Commands: ${totalCmds}+\n` +
      `🌐 Edition: ${GHOST.botEdition}\n` +
      `🏠 TimeZone: ${GHOST.timeZone}\n\n` +
      `👻 ━━━━━━━━━━━━━━━━━━━━━ 👻`
    );
  }
};
