const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "switchfca",
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 2,
    shortDescription: "FCA switch করো",
    longDescription: "fb-chat-api এবং fca-unofficial এর মধ্যে switch করো",
    category: "owner",
    guide: "{pn} [fb-chat-api | fca-unofficial]",
  },
  onStart: async function ({ api, event, args, message }) {
    const mode = (args[0] || "").toLowerCase();
    const configPath = path.join(__dirname, "../../config.json");
    const config = fs.readJsonSync(configPath);

    if (!mode || !["fb-chat-api", "fca-unofficial"].includes(mode)) {
      const current = config.fcaMode || "fb-chat-api";
      return message.reply(
        `👻 𝗚𝗵𝗼𝘀𝘁 𝗕𝗼𝘁 — FCA Switch\n\n` +
        `📌 Current mode: ${current}\n\n` +
        `🔄 Available modes:\n` +
        `  • fb-chat-api (built-in, stable)\n` +
        `  • fca-unofficial (@xaviabot)\n\n` +
        `Usage: .switchfca fb-chat-api\n` +
        `       .switchfca fca-unofficial\n\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 Owner: ${GHOST.ownerName}\n` +
        `🌐 ${GHOST.botEdition}`
      );
    }

    config.fcaMode = mode;
    fs.writeJsonSync(configPath, config, { spaces: 2 });

    return message.reply(
      `✅ FCA mode switched to: ${mode}\n\n` +
      `🔄 Bot restart করো পরিবর্তন কার্যকর হতে: .restart\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👻 Ghost Bot — ${GHOST.ownerName}`
    );
  }
};
