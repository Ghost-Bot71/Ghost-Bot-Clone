const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfstory", aliases: ["story2", "aiwrite"],
    version: "1.0", author: "Rakib Islam", countDown: 10, role: 0,
    shortDescription: "AI দিয়ে গল্প লেখো", longDescription: "HuggingFace GPT-2 দিয়ে creative story লেখো",
    category: "ai", guide: "{pn} [story beginning]",
  },
  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply(`Usage: .hfstory Once upon a time in Bangladesh...\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const prompt = args.join(" ");
    message.reply("✍️ Story লিখছি...");
    try {
      const res = await axios.post("https://api-inference.huggingface.co/models/gpt2-large",
        { inputs: prompt, parameters: { max_new_tokens: 200, temperature: 0.9, do_sample: true } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, timeout: 30000 }
      );
      const text = Array.isArray(res.data) ? res.data[0]?.generated_text : res.data?.generated_text;
      message.reply(`📖 𝗔𝗜 𝗦𝘁𝗼𝗿𝘆\n\n${text?.slice(0, 600)}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName} | Ghost Net Edition`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
