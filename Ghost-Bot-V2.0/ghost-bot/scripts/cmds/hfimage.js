const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfimage", aliases: ["hfimg", "aiimage", "imagine2"],
    version: "1.0", author: "Rakib Islam",
    countDown: 15, role: 0,
    shortDescription: "AI দিয়ে image বানাও (SDXL)",
    longDescription: "HuggingFace Stable Diffusion XL দিয়ে image generate করো",
    category: "ai", guide: "{pn} [prompt]",
  },
  onStart: async function ({ api, event, message, args }) {
    if (!args[0]) return message.reply(`Usage: .hfimage [prompt]\nExample: .hfimage anime girl with sword\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    const prompt = args.join(" ");
    message.reply(`🎨 Image বানাচ্ছি...\n✨ Prompt: "${prompt}"`);
    try {
      const res = await axios.post(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        { inputs: prompt },
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }, responseType: "arraybuffer", timeout: 60000 }
      );
      const tmpPath = path.join(__dirname, "cache", `hfimg_${Date.now()}.png`);
      fs.ensureDirSync(path.dirname(tmpPath));
      fs.writeFileSync(tmpPath, Buffer.from(res.data));
      await api.sendMessage({ body: `🎨 AI Generated Image\n\n✨ Prompt: "${prompt}"\n🤖 Model: Stable Diffusion XL\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`, attachment: fs.createReadStream(tmpPath) }, event.threadID, () => fs.unlinkSync(tmpPath));
    } catch (e) { message.reply(`❌ Image তৈরি হয়নি: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
