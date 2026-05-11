const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfroast", aliases: ["airoast", "roastai"],
    version: "1.0", author: "Rakib Islam", countDown: 5, role: 0,
    shortDescription: "AI দিয়ে roast করো", longDescription: "HuggingFace AI দিয়ে কাউকে funny roast করো",
    category: "fun", guide: "{pn} [name]",
  },
  onStart: async function ({ message, args }) {
    const name = args.join(" ") || "someone";
    message.reply("🔥 Roast বানাচ্ছি...");
    try {
      const res = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        { inputs: `<s>[INST] Write a funny, harmless roast for someone named ${name}. Make it witty and light-hearted. [/INST]`, parameters: { max_new_tokens: 150, temperature: 0.9 } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}` }, timeout: 25000 }
      );
      const text = (Array.isArray(res.data) ? res.data[0]?.generated_text : "").replace(/.*\[\/INST\]/s, "").trim();
      message.reply(`🔥 𝗔𝗜 𝗥𝗼𝗮𝘀𝘁\n\n🎯 Target: ${name}\n\n${text}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
