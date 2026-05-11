const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfsentiment", aliases: ["sentiment2", "mood", "hfmood"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "Text এর mood/sentiment বিশ্লেষণ করো",
    longDescription: "HuggingFace দিয়ে text এর sentiment (positive/negative/neutral) বের করো",
    category: "ai", guide: "{pn} [text]",
  },
  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply(`Usage: .hfsentiment I love this!\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const text = args.join(" ");
    try {
      const res = await axios.post(
        "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
        { inputs: text },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, timeout: 20000 }
      );
      const results = Array.isArray(res.data) ? res.data[0] : res.data;
      const sorted = results.sort((a, b) => b.score - a.score);
      const top = sorted[0];
      const emoji = top.label.toLowerCase().includes("pos") ? "😊" : top.label.toLowerCase().includes("neg") ? "😠" : "😐";
      const bar = sorted.map(r => `${r.label}: ${(r.score * 100).toFixed(1)}%`).join("\n");
      message.reply(`${emoji} 𝗦𝗲𝗻𝘁𝗶𝗺𝗲𝗻𝘁 𝗔𝗻𝗮𝗹𝘆𝘀𝗶𝘀\n\n💬 Text: "${text}"\n\n📊 Results:\n${bar}\n\n🏆 Top: ${top.label} (${(top.score * 100).toFixed(1)}%)\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
