const os = require("os");
const axios = require("axios");

module.exports = {
  config: {
    name: "meminfo",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["memory", "ram", "raminfo"],
    countDown: 5,
    role: 0,
    shortDescription: "Memory usage with animated GIF bar",
    longDescription: "Detailed RAM / memory info with animated bar chart and GIF card",
    category: "utility",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const pct = Math.round((used / total) * 100);
    const toMB = (b) => Math.round(b / 1024 / 1024);

    const fullBar = Math.floor(pct / 5);
    const emptyBar = 20 - fullBar;
    const bar = "▓".repeat(fullBar) + "░".repeat(emptyBar);

    const procMem = process.memoryUsage();

    const body = `💾 ᴍᴇᴍᴏʀʏ ᴍᴏɴɪᴛᴏʀ 💾\n${"═".repeat(28)}\n\n🖥️ System RAM:\n   [${bar}]\n   Used  : ${toMB(used)} MB (${pct}%)\n   Free  : ${toMB(free)} MB\n   Total : ${toMB(total)} MB\n\n🤖 Bot Process:\n   Heap  : ${toMB(procMem.heapUsed)} / ${toMB(procMem.heapTotal)} MB\n   RSS   : ${toMB(procMem.rss)} MB\n   Ext   : ${toMB(procMem.external)} MB\n\n${"═".repeat(28)}\n👻 Ghost Bot — Memory Monitor`;

    const gif = "https://media.tenor.com/7Sv6qCJbqhsAAAAC/ghost-loading.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const s = new PassThrough(); s.end(Buffer.from(res.data));
      message.reply({ body, attachment: s });
    } catch { message.reply(body); }
  }
};
