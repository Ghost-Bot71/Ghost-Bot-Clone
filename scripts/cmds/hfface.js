const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfface", aliases: ["faceswap", "facedetect"],
    version: "1.0", author: "Rakib Islam", countDown: 15, role: 0,
    shortDescription: "Random face generate করো", longDescription: "HuggingFace দিয়ে AI generated realistic face বানাও",
    category: "ai", guide: "{pn} [description] e.g. young woman with blue eyes",
  },
  onStart: async function ({ api, event, message, args }) {
    const desc = args.join(" ") || "a realistic portrait of a person";
    message.reply(`🖼️ Face generate করছি...\n"${desc}"`);
    try {
      const res = await axios.post("https://api-inference.huggingface.co/models/prompthero/openjourney",
        { inputs: `portrait photo, ${desc}, photorealistic, 4k, detailed face` },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, responseType: "arraybuffer", timeout: 60000 }
      );
      const tmpPath = path.join(__dirname, "cache", `face_${Date.now()}.png`);
      fs.ensureDirSync(path.dirname(tmpPath));
      fs.writeFileSync(tmpPath, Buffer.from(res.data));
      await api.sendMessage({ body: `🖼️ 𝗔𝗜 𝗙𝗮𝗰𝗲\n\n✨ "${desc}"\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`, attachment: fs.createReadStream(tmpPath) }, event.threadID, () => fs.unlinkSync(tmpPath));
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
