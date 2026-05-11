const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfcode", aliases: ["aicode2", "codegen"],
    version: "1.0", author: "Rakib Islam", countDown: 10, role: 0,
    shortDescription: "AI দিয়ে code লেখো", longDescription: "HuggingFace CodeLlama দিয়ে code generate করো",
    category: "ai", guide: "{pn} [code description]",
  },
  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply(`Usage: .hfcode function to sort array in JavaScript\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const prompt = args.join(" ");
    message.reply("💻 Code লিখছি...");
    try {
      const res = await axios.post(
        "https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-Instruct-hf",
        { inputs: `[INST] Write code: ${prompt} [/INST]`, parameters: { max_new_tokens: 300, temperature: 0.3 } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, timeout: 40000 }
      );
      let code = Array.isArray(res.data) ? res.data[0]?.generated_text : res.data?.generated_text;
      code = code?.replace(/.*\[\/INST\]/s, "").trim() || code;
      message.reply(`💻 𝗔𝗜 𝗖𝗼𝗱𝗲 𝗚𝗲𝗻\n\n📌 Task: ${prompt}\n\n\`\`\`\n${code?.slice(0, 800)}\n\`\`\`\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
