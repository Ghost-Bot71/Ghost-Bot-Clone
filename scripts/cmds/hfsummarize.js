const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfsummarize", aliases: ["hfsum", "summarize2", "tldr"],
    version: "1.0", author: "Rakib Islam", countDown: 8, role: 0,
    shortDescription: "Long text summarize করো", longDescription: "HuggingFace BART দিয়ে long text কে short summary তে convert করো",
    category: "ai", guide: "{pn} [long text]",
  },
  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply(`Usage: .hfsummarize [long text here]\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const text = args.join(" ");
    if (text.length < 50) return message.reply(`❌ Text অনেক ছোট। কমপক্ষে ৫০ character দাও।\n\n👻 Ghost Bot`);
    message.reply("📝 Summarizing...");
    try {
      const res = await axios.post("https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        { inputs: text, parameters: { max_length: 150, min_length: 30 } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, timeout: 30000 }
      );
      const summary = Array.isArray(res.data) ? res.data[0]?.summary_text : res.data?.summary_text;
      message.reply(`📝 𝗦𝘂𝗺𝗺𝗮𝗿𝘆\n\n📖 Original (${text.length} chars):\n${text.slice(0, 100)}...\n\n✅ Summary:\n${summary}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
