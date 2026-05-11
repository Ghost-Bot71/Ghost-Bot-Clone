const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "leave",
    version: "3.0",
    author: "Rakib Islam",
    category: "events"
  },

  onStart: async ({ threadsData, message, event, api, usersData }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    return async function () {
      const { threadID } = event;
      const threadData = await threadsData.get(threadID);
      if (!threadData.settings.sendLeaveMessage) return;

      const { leftParticipantFbId } = event.logMessageData;
      if (leftParticipantFbId === api.getCurrentUserID()) return;

      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName || "Group";
      const memberCount = threadInfo.participantIDs.length;
      const userName = await usersData.getName(leftParticipantFbId).catch(() => "User");
      const leaveType = leftParticipantFbId === event.author ? "left" : "was kicked from";

      const timeStr = new Date().toLocaleString("en-BD", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit", minute: "2-digit",
        weekday: "short", year: "numeric",
        month: "short", day: "2-digit",
        hour12: true
      });

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const imgPath = path.join(cacheDir, `leave_${leftParticipantFbId}_${Date.now()}.png`);

      try {
        const apiUrl = `https://xsaim8x-xxx-api.onrender.com/api/leave?name=${encodeURIComponent(userName)}&uid=${leftParticipantFbId}&threadname=${encodeURIComponent(groupName)}&members=${memberCount}`;
        const response = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 15000 });
        fs.writeFileSync(imgPath, response.data);

        await api.sendMessage({
          body:
            `👋 𝗚𝗼𝗼𝗱𝗯𝘆𝗲, ${userName}!\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `😢 ${userName} ${leaveType} ${groupName}\n` +
            `👥 Members left: ${memberCount}\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `📅 ${timeStr}`,
          attachment: fs.createReadStream(imgPath),
          mentions: [{ tag: userName, id: leftParticipantFbId }]
        }, threadID);

        try { fs.unlinkSync(imgPath); } catch {}

      } catch (err) {
        await api.sendMessage({
          body:
            `👋 𝗚𝗼𝗼𝗱𝗯𝘆𝗲!\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `😢 ${userName} ${leaveType} the group\n` +
            `👥 Members left: ${memberCount}\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `📅 ${timeStr}`,
          mentions: [{ tag: userName, id: leftParticipantFbId }]
        }, threadID);
      }
    };
  }
};
