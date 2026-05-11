const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";
const chatHistory = new Map();

module.exports = {
  config: {
    name: "hfchat", aliases: ["ghostai", "ghostchat"],
    version: "1.0", author: "Rakib Islam", countDown: 5, role: 0,
    shortDescription: "Ghost Bot AI এর সাথে chat করো", longDescription: "HuggingFace Zephyr দিয়ে Ghost Bot AI persona তে chat করো",
    category: "ai", guide: "{pn} [message] | {pn} clear",
  },
  onStart: async function ({ message, args, event }) {
    if (args[0] === "clear") { chatHistory.delete(event.senderID); return message.reply(`🗑️ Chat history cleared!\n\n👻 Ghost Bot — ${GHOST.ownerName}`); }
    if (!args[0]) return message.reply(`💬 Usage: .hfchat Hello!\n\n🤖 Ghost Bot AI — Powered by HuggingFace\n👻 ${GHOST.ownerName} | Ghost Net Edition`);
    const userMsg = args.join(" ");
    const history = chatHistory.get(event.senderID) || [];
    const systemPrompt = `You are Ghost Bot, a helpful AI assistant created by Rakib Islam from Saidpur, Nilphamari. Be friendly, helpful, and a bit playful.`;
    const prompt = `<|system|>\n${systemPrompt}</s>\n${history.slice(-4).join("\n")}\n<|user|>\n${userMsg}</s>\n<|assistant|>`;
    message.reply("🤖 Thinking...");
    try {
      const res = await axios.post("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
        { inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.7, return_full_text: false } },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, timeout: 30000 }
      );
      const reply = Array.isArray(res.data) ? res.data[0]?.generated_text : res.data?.generated_text;
      const clean = reply?.trim() || "দুঃখিত, বুঝতে পারিনি।";
      history.push(`<|user|>\n${userMsg}</s>`, `<|assistant|>\n${clean}</s>`);
      if (history.length > 10) history.splice(0, 2);
      chatHistory.set(event.senderID, history);
      message.reply(`👻 𝗚𝗵𝗼𝘀𝘁 𝗔𝗜\n\n${clean}\n\n━━━━━━━━━━━━━━━━━━\n🤖 Zephyr-7B | ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
