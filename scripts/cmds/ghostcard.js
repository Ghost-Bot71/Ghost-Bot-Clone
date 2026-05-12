const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const GHOST = fs.readJsonSync(path.join(__dirname, "../../ghostConfig.json"));

module.exports = {
  config: {
    name: "ghostcard",
    aliases: ["gc", "profilecard", "gcard"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 8,
    role: 0,
    shortDescription: "👻 Ghost Profile Card — cool dark template",
    longDescription: "User এর profile card তৈরি করো — dark ghost theme এ avatar + name + title + status সহ।",
    category: "image",
    guide: [
      "{pn} — নিজের card",
      "{pn} @mention — অন্যের card",
      "{pn} @mention - [title] - [status]",
      "Example: .ghostcard @Hinata - Anime Fan - Always Online",
    ].join("\n"),
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    const mentionIDs = Object.keys(mentions || {});
    const targetID = mentionIDs[0] || messageReply?.senderID || senderID;

    api.setMessageReaction("🎨", messageID, () => {}, true);

    let targetName = "Ghost User";
    try { targetName = await usersData.getName(targetID) || "Ghost User"; } catch {}

    const input = args.join(" ");
    const parts = input.split("-").map(s => s.trim());
    let title = parts[1] || "Ghost Bot Member";
    let status = parts[2] || "Ghost Net Edition";

    const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

    const templates = [
      {
        name: "Dark Ghost",
        url: (av, n, t, s) =>
          `https://api.popcat.xyz/welcomecard?background=0d0d1a&text1=${encodeURIComponent(n)}&text2=${encodeURIComponent(t)}&text3=${encodeURIComponent(s)}&avatar=${encodeURIComponent(av)}`
      },
      {
        name: "Purple Night",
        url: (av, n, t, s) =>
          `https://api.popcat.xyz/welcomecard?background=1a0a2e&text1=${encodeURIComponent(n)}&text2=${encodeURIComponent(t)}&text3=${encodeURIComponent(s)}&avatar=${encodeURIComponent(av)}`
      },
      {
        name: "Ghost Gradient",
        url: (av, n, t, s) =>
          `https://api.popcat.xyz/welcomecard?background=0f0f23&text1=${encodeURIComponent(n)}&text2=${encodeURIComponent(t)}&text3=${encodeURIComponent(s)}&avatar=${encodeURIComponent(av)}`
      },
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const cardUrl = template.url(avatarUrl, targetName, title, status);

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const outPath = path.join(cacheDir, `ghostcard_${Date.now()}.png`);

    let imgBuffer;
    try {
      const res = await axios.get(cardUrl, { responseType: "arraybuffer", timeout: 15000 });
      imgBuffer = Buffer.from(res.data);
    } catch {
      try {
        const fallUrl = `https://api.popcat.xyz/welcomecard?background=212121&text1=${encodeURIComponent(targetName)}&text2=${encodeURIComponent(title)}&text3=${encodeURIComponent(status)}&avatar=${encodeURIComponent(avatarUrl)}`;
        const res2 = await axios.get(fallUrl, { responseType: "arraybuffer", timeout: 12000 });
        imgBuffer = Buffer.from(res2.data);
      } catch (e) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return message.reply(`❌ Profile card তৈরি করা যায়নি।\nError: ${e.message}`);
      }
    }

    await fs.writeFile(outPath, imgBuffer);

    await api.sendMessage(
      {
        body: `👻 𝗚𝗵𝗼𝘀𝘁 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗖𝗮𝗿𝗱\n━━━━━━━━━━━━━━━━━━\n👤 Name: ${targetName}\n🏷️ Title: ${title}\n📌 Status: ${status}\n🎨 Theme: ${template.name}\n━━━━━━━━━━━━━━━━━━\n👻 Ghost Bot — ${GHOST.ownerName}`,
        attachment: fs.createReadStream(outPath),
      },
      threadID,
      () => { try { fs.unlinkSync(outPath); } catch {} },
      messageID
    );
    api.setMessageReaction("✅", messageID, () => {}, true);
  }
};
