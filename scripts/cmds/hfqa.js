const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfqa", aliases: ["qa", "answer"],
    version: "1.0", author: "Rakib Islam", countDown: 5, role: 0,
    shortDescription: "Context থেকে উত্তর বের করো",
    longDescription: "HuggingFace deepset QA model দিয়ে context থেকে নির্দিষ্ট প্রশ্নের উত্তর বের করো",
    category: "ai", guide: "{pn} question | context",
  },
  onStart: async function ({ message, args }) {
    const text = args.join(" ");
    const parts = text.split("|");
    if (parts.length < 2) return message.reply(`Usage: .hfqa What is AI? | AI is artificial intelligence...\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const question = parts[0].trim();
    const context = parts[1].trim();
    message.reply("🔍 Answering...");
    try {
      const res = await axios.post("https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
        { inputs: { question, context } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, timeout: 20000 }
      );
      const answer = res.data?.answer;
      const score = ((res.data?.score || 0) * 100).toFixed(1);
      message.reply(`🔍 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗔𝗻𝘀𝘄𝗲𝗿𝗶𝗻𝗴\n\n❓ Q: ${question}\n📖 Context: ${context.slice(0, 100)}...\n\n✅ Answer: ${answer}\n📊 Confidence: ${score}%\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
