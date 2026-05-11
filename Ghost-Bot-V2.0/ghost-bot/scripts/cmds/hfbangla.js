const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfbangla", aliases: ["bnai", "banglaai"],
    version: "1.0", author: "Rakib Islam", countDown: 8, role: 0,
    shortDescription: "বাংলায় AI উত্তর পাও", longDescription: "HuggingFace Mistral দিয়ে বাংলায় প্রশ্নের উত্তর পাও",
    category: "ai", guide: "{pn} [বাংলায় প্রশ্ন]",
  },
  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply(`Usage: .hfbangla বাংলাদেশের রাজধানী কী?\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const q = args.join(" ");
    message.reply("🤖 চিন্তা করছি...");
    try {
      const prompt = `<s>[INST] Answer this in Bangla language: ${q} [/INST]`;
      const res = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        { inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.7 } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}` }, timeout: 30000 }
      );
      const text = (Array.isArray(res.data) ? res.data[0]?.generated_text : res.data?.generated_text || "").replace(/.*\[\/INST\]/s, "").trim();
      message.reply(`🇧🇩 𝗕𝗮𝗻𝗴𝗹𝗮 𝗔𝗜\n\n❓ ${q}\n\n✅ ${text}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
