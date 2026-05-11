const os = require("os");
const axios = require("axios");

module.exports = {
  config: {
    name: "netinfo",
    version: "2.0",
    author: "Rakib Islam",
    aliases: ["network", "netstat", "ipinfo"],
    countDown: 10,
    role: 0,
    shortDescription: "Network info & connectivity check with GIF",
    longDescription: "Shows network interfaces, connectivity test, and latency with animated GIF",
    category: "utility",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    const startTime = Date.now();
    let latency = "?";
    let internetOk = false;
    try {
      await axios.get("https://1.1.1.1", { timeout: 3000 });
      latency = (Date.now() - startTime) + "ms";
      internetOk = true;
    } catch {}

    const nets = os.networkInterfaces();
    const netLines = [];
    for (const [name, addrs] of Object.entries(nets)) {
      for (const addr of (addrs || [])) {
        if (!addr.internal) netLines.push(`   ${name}: ${addr.address} (${addr.family})`);
      }
    }

    const body = `🌐 ɴᴇᴛᴡᴏʀᴋ ꜱᴛᴀᴛᴜꜱ 🌐\n${"═".repeat(28)}\n\n${internetOk ? "🟢 Internet: CONNECTED" : "🔴 Internet: OFFLINE"}\n⚡ Latency : ${latency}\n🏠 Hostname: ${os.hostname()}\n\n🔌 Interfaces:\n${netLines.slice(0, 4).join("\n") || "   No external interfaces"}\n\n📊 DNS Test   : ${internetOk ? "✅ Pass" : "❌ Fail"}\n🔗 Bot Signal : ${internetOk ? "🟢 Strong" : "🔴 Weak"}\n\n${"═".repeat(28)}\n👻 Ghost Bot — Network Monitor`;

    const gif = "https://media.tenor.com/p5gbLxCzB7cAAAAC/demon-slayer.gif";
    try {
      const res = await axios.get(gif, { responseType: "arraybuffer", timeout: 8000 });
      const { PassThrough } = require("stream");
      const s = new PassThrough(); s.end(Buffer.from(res.data));
      message.reply({ body, attachment: s });
    } catch { message.reply(body); }
  }
};
