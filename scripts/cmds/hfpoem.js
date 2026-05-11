const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfpoem", aliases: ["poem2", "aipoem"],
    version: "1.0", author: "Rakib Islam", countDown: 10, role: 0,
    shortDescription: "AI দিয়ে কবিতা লেখো", longDescription: "HuggingFace GPT-2 দিয়ে creative poem/kobita লেখো",
    category: "ai", guide: "{pn} [topic]",
  },
  onStart: async function ({ message, args }) {
    const topic = args.join(" ") || "the beauty of Bangladesh";
    message.reply("🌸 কবিতা লিখছি...");
    try {
      const res = await axios.post("https://api-inference.huggingface.co/models/gpt2-medium",
        { inputs: `A beautiful poem about ${topic}:\n`, parameters: { max_new_tokens: 150, temperature: 0.9, do_sample: true } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, timeout: 30000 }
      );
      const poem = Array.isArray(res.data) ? res.data[0]?.generated_text : res.data?.generated_text;
      message.reply(`🌸 𝗔𝗜 𝗣𝗼𝗲𝗺\n\n📌 Topic: ${topic}\n\n${poem?.slice(0, 500)}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
