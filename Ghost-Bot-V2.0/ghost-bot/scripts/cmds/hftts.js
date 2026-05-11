const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hftts", aliases: ["tts2", "speak", "voice2"],
    version: "1.0", author: "Rakib Islam", countDown: 10, role: 0,
    shortDescription: "Text to Speech (HuggingFace)", longDescription: "HuggingFace MMS-TTS দিয়ে text কে voice এ convert করো",
    category: "ai", guide: "{pn} [text]",
  },
  onStart: async function ({ api, event, message, args }) {
    if (!args[0]) return message.reply(`Usage: .hftts Hello I am Ghost Bot!\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const text = args.join(" ").slice(0, 200);
    message.reply(`🔊 Voice বানাচ্ছি...\n"${text}"`);
    try {
      const res = await axios.post("https://api-inference.huggingface.co/models/facebook/mms-tts-eng",
        { inputs: text },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, responseType: "arraybuffer", timeout: 30000 }
      );
      const tmpPath = path.join(__dirname, "cache", `tts_${Date.now()}.flac`);
      fs.ensureDirSync(path.dirname(tmpPath));
      fs.writeFileSync(tmpPath, Buffer.from(res.data));
      await api.sendMessage({ body: `🔊 𝗧𝗲𝘅𝘁-𝘁𝗼-𝗦𝗽𝗲𝗲𝗰𝗵\n\n💬 "${text}"\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`, attachment: fs.createReadStream(tmpPath) }, event.threadID, () => fs.unlinkSync(tmpPath));
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
