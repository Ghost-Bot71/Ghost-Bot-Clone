const os = require("os");
const axios = require("axios");

module.exports = {
  config: {
    name: "sysmon",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["system", "systeminfo", "sysinfo2"],
    countDown: 5,
    role: 0,
    shortDescription: "Full system monitoring dashboard with GIF",
    longDescription: "Complete system monitor — RAM, CPU, uptime, process info in one animated GIF card",
    category: "utility",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    const upSec = Math.floor(process.uptime());
    const sysUp = Math.floor(os.uptime());
    const h = Math.floor(upSec / 3600), m = Math.floor((upSec % 3600) / 60);
    const sh = Math.floor(sysUp / 3600), sm = Math.floor((sysUp % 3600) / 60);
    const used = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
    const total = Math.round(os.totalmem() / 1024 / 1024);
    const pct = Math.round((used / total) * 100);
    const bar = "█".repeat(Math.floor(pct / 10)) + "░".repeat(10 - Math.floor(pct / 10));

    const body = `🖥️ ꜱʏꜱᴛᴇᴍ ᴍᴏɴɪᴛᴏʀ 🖥️\n${"◆".repeat(28)}\n\n🤖 Bot Uptime  : ${h}h ${m}m\n🖥️ Sys Uptime  : ${sh}h ${sm}m\n\n💾 RAM: [${bar}] ${pct}%\n   ${used}MB / ${total}MB\n\n⚙️ CPU Cores   : ${os.cpus().length}\n📊 Load 1m     : ${os.loadavg()[0].toFixed(2)}\n\n🔧 Node.js     : ${process.version}\n🏠 Hostname    : ${os.hostname()}\n🌡️ OS Type     : ${os.type()}\n\n${"◆".repeat(28)}\n👻 Ghost Bot — System Monitor v2.0`;

    const gif = "https://media.tenor.com/oMa1m_TzwVkAAAAC/anime-cool.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const s = new PassThrough(); s.end(Buffer.from(res.data));
      message.reply({ body, attachment: s });
    } catch { message.reply(body); }
  }
};
