const os = require("os");
const axios = require("axios");

module.exports = {
  config: {
    name: "perfcheck",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["perf", "performance", "speedcheck"],
    countDown: 10,
    role: 0,
    shortDescription: "Performance check with ping & speed with GIF",
    longDescription: "Runs a quick performance check — ping, memory speed, response time with animated GIF",
    category: "utility",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    const t1 = Date.now();
    let ping = 0, netOk = false;
    try {
      await axios.get("https://httpbin.org/get", { timeout: 5000 });
      ping = Date.now() - t1;
      netOk = true;
    } catch {
      ping = 9999;
    }

    const used = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
    const total = Math.round(os.totalmem() / 1024 / 1024);
    const pct = Math.round((used / total) * 100);

    const grade = ping < 100 ? "A+ ⭐⭐⭐⭐⭐" : ping < 300 ? "B+ ⭐⭐⭐⭐" : ping < 500 ? "C+ ⭐⭐⭐" : "D ⭐⭐";

    const body = `🏎️ ᴘᴇʀꜰᴏʀᴍᴀɴᴄᴇ ᴄʜᴇᴄᴋ 🏎️\n${"▬".repeat(26)}\n\n🌐 Network Test:\n   ${netOk ? "✅ PASSED" : "❌ FAILED"}\n   Ping: ${ping}ms\n   Grade: ${grade}\n\n💾 Memory Health:\n   RAM Used: ${pct}% (${used}/${total}MB)\n   Status: ${pct < 70 ? "✅ Healthy" : pct < 90 ? "⚠️ High" : "🔴 Critical"}\n\n⚡ Response Time: ${Date.now() - t1}ms\n\n📊 Overall Performance:\n   ${ping < 200 && pct < 80 ? "🟢 EXCELLENT" : ping < 500 ? "🟡 GOOD" : "🔴 NEEDS ATTENTION"}\n\n${"▬".repeat(26)}\n👻 Ghost Bot — Performance Monitor`;

    const gif = "https://media.tenor.com/7N-PcvGZsYMAAAAC/dark-anime.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const s = new PassThrough(); s.end(Buffer.from(res.data));
      message.reply({ body, attachment: s });
    } catch { message.reply(body); }
  }
};
