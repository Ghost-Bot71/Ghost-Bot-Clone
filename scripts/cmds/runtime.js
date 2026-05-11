const os = require("os");
const axios = require("axios");

module.exports = {
  config: {
    name: "runtime",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["botruntime", "processinfo"],
    countDown: 5,
    role: 0,
    shortDescription: "Bot runtime & process info with GIF animation",
    longDescription: "Detailed runtime information — process stats, memory heap, V8 engine info",
    category: "utility",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    const mem = process.memoryUsage();
    const toMB = (b) => (b / 1024 / 1024).toFixed(2);
    const upSec = Math.floor(process.uptime());
    const h = Math.floor(upSec / 3600);
    const m = Math.floor((upSec % 3600) / 60);

    const body = `⚡ ʀᴜɴᴛɪᴍᴇ ɪɴꜰᴏ ⚡\n${"▬".repeat(26)}\n\n🔄 Process Uptime: ${h}h ${m}m\n📦 PID          : ${process.pid}\n🔧 Node.js      : ${process.version}\n🖥️ Architecture : ${process.arch}\n\n🧠 Memory (Heap):\n   Used   : ${toMB(mem.heapUsed)} MB\n   Total  : ${toMB(mem.heapTotal)} MB\n   RSS    : ${toMB(mem.rss)} MB\n   External: ${toMB(mem.external)} MB\n\n🌡️ V8 Version   : ${process.versions.v8}\n🔗 OpenSSL      : ${process.versions.openssl}\n\n${"▬".repeat(26)}\n👻 Ghost Bot Runtime Monitor`;

    const gif = "https://media.tenor.com/A5RJ0VFVLMQAAAAC/cyber-hacker.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const s = new PassThrough(); s.end(Buffer.from(res.data));
      message.reply({ body, attachment: s });
    } catch { message.reply(body); }
  }
};
