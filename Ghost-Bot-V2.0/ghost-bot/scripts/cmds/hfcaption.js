const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));
const HF_TOKEN = process.env.HF_TOKEN || "";

module.exports = {
  config: {
    name: "hfcaption", aliases: ["imgcaption", "describepic"],
    version: "1.0", author: "Rakib Islam", countDown: 10, role: 0,
    shortDescription: "Image এর description বলো", longDescription: "HuggingFace BLIP দিয়ে image এর caption/description generate করো",
    category: "ai", guide: "{pn} — reply to an image",
  },
  onStart: async function ({ api, event, message, args }) {
    const replied = event.messageReply;
    if (!replied?.attachments?.length || replied.attachments[0].type !== "photo") {
      return message.reply(`❗ একটা photo তে reply করো তারপর .hfcaption লেখো\n\n👻 Ghost Bot — ${GHOST.ownerName}`);
    }
    message.reply("🖼️ Image analyze করছি...");
    try {
      const imgUrl = replied.attachments[0].url || replied.attachments[0].largePreviewUrl;
      const imgRes = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 15000 });
      const res = await axios.post("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
        Buffer.from(imgRes.data),
        { headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/octet-stream" }, timeout: 30000 }
      );
      const caption = Array.isArray(res.data) ? res.data[0]?.generated_text : res.data?.generated_text;
      message.reply(`🖼️ 𝗜𝗺𝗮𝗴𝗲 𝗖𝗮𝗽𝘁𝗶𝗼𝗻\n\n📝 ${caption}\n\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`);
    } catch (e) { message.reply(`❌ Error: ${e.message}\n\n👻 Ghost Bot`); }
  }
};
