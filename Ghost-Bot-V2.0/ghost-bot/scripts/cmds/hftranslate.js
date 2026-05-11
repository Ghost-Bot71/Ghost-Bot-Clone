const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

const MODELS = {
  bn: "Helsinki-NLP/opus-mt-en-bn",
  en: "Helsinki-NLP/opus-mt-bn-en",
  fr: "Helsinki-NLP/opus-mt-en-fr",
  ar: "Helsinki-NLP/opus-mt-en-ar",
  hi: "Helsinki-NLP/opus-mt-en-hi",
  es: "Helsinki-NLP/opus-mt-en-es",
  de: "Helsinki-NLP/opus-mt-en-de",
  ja: "Helsinki-NLP/opus-mt-en-jap",
  zh: "Helsinki-NLP/opus-mt-en-zh",
};

module.exports = {
  config: {
    name: "hftranslate", aliases: ["hftrans", "translate2"],
    version: "1.0", author: "Rakib Islam",
    countDown: 5, role: 0,
    shortDescription: "HF দিয়ে translate করো",
    longDescription: "HuggingFace Helsinki-NLP দিয়ে translation করো",
    category: "ai", guide: "{pn} [lang] [text] | langs: bn, en, fr, ar, hi, es, de",
  },
  onStart: async function ({ message, args }) {
    const lang = (args[0] || "bn").toLowerCase();
    const text = args.slice(1).join(" ");
    if (!text) return message.reply(`Usage: .hftranslate bn Hello world\nAvailable: bn, en, fr, ar, hi, es, de\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const model = MODELS[lang] || MODELS.bn;
    message.reply(`🌐 Translating to ${lang.toUpperCase()}...`);
    try {
      const res = await axios.post(`https://api-inference.huggingface.co/models/${model}`, { inputs: text }, { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, timeout: 20000 });
      const translated = Array.isArray(res.data) ? res.data[0]?.translation_text : res.data?.translation_text;
      message.reply(`🌐 𝗛𝗙 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗲\n\n📝 Original: ${text}\n🌍 ${lang.toUpperCase()}: ${translated}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Translation error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
