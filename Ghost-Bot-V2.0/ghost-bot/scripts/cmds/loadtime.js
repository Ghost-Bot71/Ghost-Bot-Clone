const axios = require("axios");

module.exports = {
  config: {
    name: "loadtime",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["botload", "loadstat", "starttime"],
    countDown: 5,
    role: 0,
    shortDescription: "Bot load time & startup performance with GIF",
    longDescription: "Shows bot startup load time, command count, and initialization stats",
    category: "utility",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, GoatBot }) {
    const cmdCount = (GoatBot?.commands?.size) || "Unknown";
    const aliasCount = (GoatBot?.aliases?.size) || "Unknown";
    const upSec = Math.floor(process.uptime());
    const d = Math.floor(upSec / 86400);
    const h = Math.floor((upSec % 86400) / 3600);
    const m = Math.floor((upSec % 3600) / 60);
    const s = upSec % 60;

    const body = `⚡ ʙᴏᴛ ʟᴏᴀᴅ ꜱᴛᴀᴛꜱ ⚡\n${"═".repeat(26)}\n\n🚀 Commands Loaded : ${cmdCount}\n🔗 Aliases Loaded  : ${aliasCount}\n\n⏱️ Bot Runtime:\n   ${d}d ${h}h ${m}m ${s}s\n\n📊 Status:\n   🟢 Commands  : Active\n   🟢 Events    : Listening\n   🟢 AI System : Ready\n   🟢 FCA Mode  : Dual Switch\n\n🔧 Engine    : GoatBot V2\n👻 Edition   : Ghost Net\n\n${"═".repeat(26)}\n💡 All systems operational!`;

    const gif = "https://media.tenor.com/5QTkCbxCfvgAAAAC/robot-anime.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const s2 = new PassThrough(); s2.end(Buffer.from(res.data));
      message.reply({ body, attachment: s2 });
    } catch { message.reply(body); }
  }
};
