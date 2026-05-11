const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfclassify", aliases: ["classify", "categorize"],
    version: "1.0", author: "Rakib Islam", countDown: 5, role: 0,
    shortDescription: "Text classify করো", longDescription: "HuggingFace zero-shot classification দিয়ে text কে categories তে classify করো",
    category: "ai", guide: "{pn} [text] | [cat1, cat2, cat3]",
  },
  onStart: async function ({ message, args }) {
    const text = args.join(" ");
    const parts = text.split("|");
    const sentence = parts[0]?.trim();
    const labels = parts[1]?.split(",").map(s => s.trim()) || ["positive", "negative", "neutral"];
    if (!sentence) return message.reply(`Usage: .hfclassify I love coding | happy, sad, angry\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    message.reply("🏷️ Classifying...");
    try {
      const res = await axios.post("https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
        { inputs: sentence, parameters: { candidate_labels: labels } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, timeout: 20000 }
      );
      const scores = res.data.labels.map((l, i) => `${l}: ${(res.data.scores[i] * 100).toFixed(1)}%`).join("\n");
      const top = res.data.labels[0];
      message.reply(`🏷️ 𝗭𝗲𝗿𝗼-𝗦𝗵𝗼𝘁 𝗖𝗹𝗮𝘀𝘀𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻\n\n💬 Text: "${sentence}"\n\n📊 Scores:\n${scores}\n\n🏆 Best: ${top}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
