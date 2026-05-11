const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfdebug", aliases: ["fixcode", "debugai"],
    version: "1.0", author: "Rakib Islam", countDown: 10, role: 0,
    shortDescription: "AI দিয়ে code debug করো", longDescription: "HuggingFace CodeLlama দিয়ে buggy code fix করো",
    category: "ai", guide: "{pn} [buggy code or error]",
  },
  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply(`Usage: .hfdebug TypeError: cannot read undefined\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const code = args.join(" ");
    message.reply("🐛 Bug fix করছি...");
    try {
      const res = await axios.post(
        "https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-Instruct-hf",
        { inputs: `[INST] Debug and fix this code/error: ${code} [/INST]`, parameters: { max_new_tokens: 300, temperature: 0.3 } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}` }, timeout: 40000 }
      );
      const fix = (Array.isArray(res.data) ? res.data[0]?.generated_text : "").replace(/.*\[\/INST\]/s, "").trim();
      message.reply(`🐛 𝗔𝗜 𝗗𝗲𝗯𝘂𝗴\n\n❌ Error: ${code.slice(0,100)}\n\n✅ Fix:\n${fix?.slice(0, 600)}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
