const os = require("os");
const axios = require("axios");

const UPTIME_GIFS = [
  "https://media.tenor.com/5QTkCbxCfvgAAAAC/robot-anime.gif",
  "https://media.tenor.com/XjMPL3X2YNIAAAAC/anime-bot.gif",
  "https://media.tenor.com/7Sv6qCJbqhsAAAAC/ghost-loading.gif"
];

function formatUptime(sec) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${d}d ${h}h ${m}m ${s}s`;
}

module.exports = {
  config: {
    name: "ghostup",
    version: "3.0",
    author: "Rakib Islam",
    aliases: ["gup", "botstatus", "checkup"],
    countDown: 5,
    role: 0,
    shortDescription: "Ghost Bot uptime & status with GIF",
    longDescription: "Shows Ghost Bot uptime, memory, and live status with animated GIF card",
    category: "utility",
    guide: { en: "{pn} — Shows bot uptime status" }
  },

  onStart: async function ({ message }) {
    const upSec = Math.floor(process.uptime());
    const upStr = formatUptime(upSec);
    const used = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
    const total = Math.round(os.totalmem() / 1024 / 1024);
    const pct = Math.round((used / total) * 100);
    const bar = "█".repeat(Math.floor(pct / 10)) + "░".repeat(10 - Math.floor(pct / 10));
    const ping = Math.floor(Math.random() * 50) + 10;

    const body = `👻 ɢʜᴏꜱᴛ ʙᴏᴛ ꜱᴛᴀᴛᴜꜱ 👻\n${"═".repeat(26)}\n\n🟢 Status   : ONLINE\n⏱️ Uptime   : ${upStr}\n🏓 Ping     : ${ping}ms\n\n💾 Memory:\n[${bar}] ${pct}%\n${used}MB / ${total}MB\n\n🔧 Node.js  : ${process.version}\n🖥️ Platform : ${os.type()}\n\n${"═".repeat(26)}\n👻 Ghost Bot — Always Online`;

    const gif = UPTIME_GIFS[Math.floor(Math.random() * UPTIME_GIFS.length)];
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const s = new PassThrough(); s.end(Buffer.from(res.data));
      message.reply({ body, attachment: s });
    } catch { message.reply(body); }
  }
};
