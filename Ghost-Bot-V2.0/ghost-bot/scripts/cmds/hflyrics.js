const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hflyrics", aliases: ["ailyrics", "genlyrics"],
    version: "1.0", author: "Rakib Islam", countDown: 10, role: 0,
    shortDescription: "AI দিয়ে গানের lyrics লেখো", longDescription: "HuggingFace GPT-2 দিয়ে song lyrics generate করো",
    category: "ai", guide: "{pn} [theme/topic]",
  },
  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply(`Usage: .hflyrics love and heartbreak\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const topic = args.join(" ");
    message.reply("🎵 Lyrics লিখছি...");
    try {
      const prompt = `[Verse 1]\nSong about ${topic}:`;
      const res = await axios.post("https://api-inference.huggingface.co/models/gpt2-medium",
        { inputs: prompt, parameters: { max_new_tokens: 200, temperature: 0.85, do_sample: true } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, timeout: 30000 }
      );
      const text = Array.isArray(res.data) ? res.data[0]?.generated_text : res.data?.generated_text;
      message.reply(`🎵 𝗔𝗜 𝗟𝘆𝗿𝗶𝗰𝘀\n\n🎤 Topic: ${topic}\n\n${text?.slice(0, 500)}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
