const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfadvice", aliases: ["advice2", "aiadvice"],
    version: "1.0", author: "Rakib Islam", countDown: 5, role: 0,
    shortDescription: "AI থেকে পরামর্শ নাও", longDescription: "HuggingFace Zephyr দিয়ে জীবনের যেকোনো বিষয়ে AI পরামর্শ নাও",
    category: "ai", guide: "{pn} [situation/problem]",
  },
  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply(`Usage: .hfadvice I am feeling lonely\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const problem = args.join(" ");
    message.reply("💡 পরামর্শ দিচ্ছি...");
    try {
      const res = await axios.post(
        "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
        { inputs: `<|system|>\nYou are a wise, empathetic life advisor.\n</s>\n<|user|>\n${problem}\n</s>\n<|assistant|>`, parameters: { max_new_tokens: 250, temperature: 0.7, return_full_text: false } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}` }, timeout: 30000 }
      );
      const advice = (Array.isArray(res.data) ? res.data[0]?.generated_text : "").trim();
      message.reply(`💡 𝗔𝗜 𝗔𝗱𝘃𝗶𝗰𝗲\n\n💬 "${problem}"\n\n${advice}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
