const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const BASE_API = "https://noobs-api.top/dipto";

const LOCAL_QA_PATH = path.join(__dirname, "bbyLocalQA.json");

const DEFAULT_QA = {
  "hello": ["Hello! 😊 Ki khobor?", "Hey! 👋 Kemon acho?", "Hi! Ami Ghost Bot, tomar khadem! 😄"],
  "hi": ["Hi! 👋 Kemon acho?", "Hello! 😊 Bolo ki dorkar!"],
  "how are you": ["Ami valo achi, tumio valo theko! 💚", "Ekdom jhakkas! 😎 Tumi kemon?"],
  "kemon acho": ["Ami valo achi! 😊 Tumi kemon?", "Ekdom mast! 🔥 Ki khobor tomar?"],
  "ki korcho": ["Tomader jonno wait korchilam! 😄", "Bas bekar boshe achi 😂", "Tomar command er jonne wait korchi!"],
  "good morning": ["Good morning! ☀️ Sundor din katao!", "Subho sokaal! 🌅 Coffee khao naki?", "Morning! 🌞 Aj onek valo din hobe!"],
  "good night": ["Good night! 🌙 Valo ghum hok!", "Sweet dreams! 😴✨", "Raat valo katuk! 🌃"],
  "good afternoon": ["Good afternoon! ☀️ Lunch kheche?", "Duperr shalam! 😊 Bisher gorm na?"],
  "good evening": ["Good evening! 🌆 Besh shundor shondha!", "Shonjher shalam! 😊"],
  "ami tomake bhalobasi": ["Ami o tumake bhalobashi! ❤️ 😊", "Aww! 🥺 Tumi o onek sundor!", "Bhalobasho? Amio! 💖"],
  "tumi ki ai": ["Haa, ami ek special AI Ghost Bot! 🤖✨ GoatBot V2 er upor toiri!", "Ami Ghost Bot — Rakib Islam er toiri! 😎"],
  "tumi ki boro": ["Ami choto kintu skills onek boro! 😂💪", "Size e choto, power e beshom! ⚡"],
  "help": ["Ami ki help korbo? Bolo! 😊", "Ki dorkar? Ami achi! 💚"],
  "ok": ["Ok! 👍", "Thik ache! ✅", "Alright! 😊"],
  "thanks": ["Welcome! 😊💚", "No problem! 🤙", "Hmm na na, eta amar kaj! 😄"],
  "thank you": ["You're welcome! 💚😊", "Koi bat nahi! 🙏", "Eta amar duty! 😎"],
  "love you": ["Aww! Love you too! ❤️😊", "Hehehe 😊 Ami o!", "Tumi onek sundor bolo! 💖"],
  "i love you": ["I love you too! ❤️", "Awww! You made my day! 💖😊"],
  "boss": ["Bolun boss! 😊🔥", "Ji boss, ki dorkar?", "Hajir boss! 💪"],
  "bhai": ["Bolun bhai! 😊", "Ji bhai, ki dorkar?", "Bhai boro manush! 💪"],
  "apu": ["Bolun apu! 😊", "Ji apu, ki help korbo?"],
  "vai": ["Bolun vai! 😊🔥", "Ji vai, ki dorkar?"],
  "tumi ki khabao": ["Amar khabar lagena, ami AI! 😂🤖", "Data khai, current khai! 😄⚡"],
  "bored": ["Bored? Kono command use koro! 😊", "Games khelo, .game likhle game ayo! 🎮", "Boring lagce? .meme dekho! 😂"],
  "busy": ["Ok, busy thako. Dorkar hole dako! 😊💚", "Buji! Shompurno hok tomar kaj! ✅"],
  "bye": ["Bye bye! 👋😊 Valo theko!", "Alvida! 🌸 Take care!", "Bye! Jaldi ashbe kintu! 😊"],
  "take care": ["You too! 💚 Take care!", "Valo theko! 🌸😊"],
  "miss you": ["Ami o miss kori! 🥺💚", "Miss you too! 😊 Jaldi ashbe?"],
  "who are you": ["Ami Ghost Bot! 👻 Rakib Islam er toiri AI bot!", "Ghost Bot — GoatBot V2 based smart Messenger bot! 🤖"],
  "tumi kon": ["Ami Ghost Bot! 👻😊", "Ghost Bot — Rakib Islam er AI bot!"],
  "name": ["Amar name Ghost Bot! 👻", "Ami Ghost Bot, tomar khadem! 😊"],
  "amar name ki": ["Ami janina tomar name! 😅 Bolo ki tomar name?"],
  "kothay thako": ["Ami cloud e thaki! ☁️😂 Server e achi!", "Replit server e bashi kori! 😄"],
  "age": ["Amar kono age nei, ami AI! 🤖😂", "Ami chirojon, age nai! 😊"],
  "ki hobay": ["Ki hobe? Bolo details e! 😊", "Describe koro, ami try korbo help korte!"],
  "subscribe": ["Subscribe korte bolo kake? 😄", "Kono channel? Bolo!"],
  "rank": ["Rank dekhte .rank likho! 🏆", ".rank command use koro!"],
  "money": ["Tomar taka dekhte .balance likho! 💰", ".balance use koro!"],
  "taka": ["Taka dekhte .balance likho! 💰😊"],
  "game": [".blackjack, .lottery, .monopoly, .wheel game khelo! 🎮😊"],
  "music": [".spotify ba .ytbsearch e music khojo! 🎵😊"],
  "image": [".image [topic] likhle sundor image pabe! 🖼️😊"],
  "funny": [".meme likhle moja moja meme pabe! 😂"],
  "story": [".hfstory likhle AI story pabe! 📖✨"],
  "weather": [".weather [city] likhle weather info pabe! ⛅"],
  "news": [".news likhle latest news pabe! 📰😊"],
  "calculate": [".calc [math] likhle calculate korte paro! 🧮"],
  "translate": [".hftranslate [lang] [text] likhle translate korbe! 🌍"],
  "lol": ["Hahaha! 😂😂", "Lol! 😂 Funny!"],
  "haha": ["Haha! 😂 Ki holo?", "Hashle keno? 😄 Bolo bolo!"],
  "hmm": ["Hmm? Ki bhavco? 🤔", "Hmm, bolo ki mone holo!"],
  "sad": ["Dukhkhito hona! 🥺💚 Ki hoise?", "Sad keno? Bolo, ami achi! 😊"],
  "happy": ["Yay! 🎉😊 Khushi thako shobshomoy!", "Happy thako shobkhon! 💚✨"],
  "angry": ["Uff! Rago koro na! 😊💚 Bolo ki hoise?", "Shanto hao please! 🙏😊"],
  "hungry": ["Kha kha! 😂 Khide lagce? Ki khabe?", "Bhojon shomoy! 🍽️😊"],
  "sleepy": ["Ghuma ghuma! 😴 Aram koro!", "Ghum jacce? Koro koro! 🌙😊"],
  "pain": ["Uff! Koshto painachi? 🥺 Valo theko!", "Shushto hao jaldi! 💚"],
  "sick": ["Uff! Shushto hao jaldi! 💊😊", "Take care! 💚 Valo theko soon!"],
  "study": ["Poro poro! 📚😊 Valo result hobe!", "Pora shona koro, bhalo hobe! 📖✨"],
  "exam": ["Exam e valo korbe! 🙏📚 Best of luck!", "Good luck exam e! 🍀😊"],
  "fail": ["Fail e ki hoise? 😊 Abar try koro!", "Fail mane end noy, try koro! 💪✨"],
  "pass": ["Congratulations! 🎉🎊 Valo korecho!", "Mashallah! 🌟😊 Valo result!"],
  "marriage": ["Biye? 😂 Aktu wait koro! 💒", "Biyar jonno ready? 😄 Mubarak!"],
  "love": ["Love is beautiful! ❤️😊", "Bhalobasho, valo thako! 💖"],
  "friend": ["Bondhu mane onno rkom! 🤝😊", "Bondhu banao, khushi thako! 💚"],
  "family": ["Family sabcheye beshi important! 👨‍👩‍👧‍👦💚", "Family er sathe valo thako! 🌸"],
  "who made you": ["Rakib Islam amare toiri koreche! 👑😊", "Amar creator holo Rakib Islam — Ghost Bot admin!"],
  "rakib": ["Haa! Rakib Islam amar boss! 👑😊", "Rakib Islam amar creator! 🔥"],
  "ghost bot": ["Ji! Ami Ghost Bot! 👻😊 Ki kora lagbe?", "Ghost Bot — Messenger er best bot! 💪🔥"],
};

function loadLocalQA() {
  if (!fs.existsSync(LOCAL_QA_PATH)) {
    fs.writeJsonSync(LOCAL_QA_PATH, DEFAULT_QA, { spaces: 2 });
  }
  const stored = fs.readJsonSync(LOCAL_QA_PATH);
  return { ...DEFAULT_QA, ...stored };
}

function saveLocalQA(data) {
  const current = fs.existsSync(LOCAL_QA_PATH) ? fs.readJsonSync(LOCAL_QA_PATH) : {};
  const merged = { ...current, ...data };
  fs.writeJsonSync(LOCAL_QA_PATH, merged, { spaces: 2 });
}

function getLocalReply(text) {
  const qa = loadLocalQA();
  const t = text.toLowerCase().trim();
  if (qa[t]) {
    const arr = qa[t];
    return arr[Math.floor(Math.random() * arr.length)];
  }
  for (const key of Object.keys(qa)) {
    if (t.includes(key) || key.includes(t)) {
      const arr = qa[key];
      return arr[Math.floor(Math.random() * arr.length)];
    }
  }
  return null;
}

async function getApiReply(text, uid) {
  const link = `${BASE_API}/baby`;
  const res = await axios.get(`${link}?text=${encodeURIComponent(text)}&senderID=${uid}&font=1`, { timeout: 8000 });
  return res.data.reply;
}

module.exports = {
  config: {
    name: "bby",
    aliases: ["bbyhelp", "bbybot", "bbabe", "sam"],
    version: "8.0",
    author: "Rakib Islam",
    countDown: 0,
    role: 0,
    description: "Ghost Bot AI Chat — pre-loaded Q&A, teach, chat",
    category: "chat",
    guide: {
      en: [
        "{pn} [anyMessage] — chat",
        "{pn} teach [message] - [reply] — সবাই শেখাতে পারবে",
        "{pn} teach react [message] - [emoji1],[emoji2] — reaction শেখাও",
        "{pn} localteach [message] - [reply] — LOCAL Q&A তে শেখাও",
        "{pn} remove [message] — remove a teach",
        "{pn} msg [message] — check replies",
        "{pn} list — total teaches",
        "{pn} locallist — local Q&A count",
        "{pn} howto — teaching guide",
      ].join("\n")
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID } = event;
    const link = `${BASE_API}/baby`;
    const dipto = args.join(" ").toLowerCase().trim();
    const uid = senderID;

    if (!args[0]) {
      const ran = [
        "Bolo bby 😊", "Ji bolo!", "Ami achi, ki dorkar?",
        "Bolo jaan ki korte paro", "Bolun, shunte achi 👂",
        "Ki holo? Kono command lagbe? 😊", "Ghost Bot ready! 👻"
      ];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], threadID, messageID);
    }

    if (args[0] === "howto" || args[0] === "help") {
      return api.sendMessage(
        `👻 Ghost Bot — BBY Teaching Guide\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📌 TEACH (API — সবাই পারবে):\n` +
        `.bby teach hello - Hi there!, Hey!\n\n` +
        `📌 LOCAL TEACH (local only):\n` +
        `.bby localteach সালাম - ওয়ালাইকুম সালাম!\n\n` +
        `📌 REACTION TEACH:\n` +
        `.bby teach react good morning - 🌅,😊,👋\n\n` +
        `📌 REMOVE:\n` +
        `.bby remove [message]\n\n` +
        `📌 CHECK:\n` +
        `.bby msg [message]\n` +
        `.bby list\n` +
        `.bby locallist\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👑 Owner: Rakib Islam | Ghost Bot`,
        threadID, messageID
      );
    }

    if (args[0] === "localteach") {
      const [comd, rep] = dipto.replace("localteach ", "").split(/\s*-\s*/);
      if (!comd || !rep || rep.length < 1) {
        return api.sendMessage("❌ Format: .bby localteach [message] - [reply1], [reply2]", threadID, messageID);
      }
      const replies = rep.split(",").map(r => r.trim()).filter(r => r);
      const qa = {};
      qa[comd.trim()] = replies;
      saveLocalQA(qa);
      return api.sendMessage(`✅ Local Q&A তে শেখানো হয়েছে!\n📝 "${comd.trim()}" → ${replies.join(", ")}`, threadID, messageID);
    }

    if (args[0] === "locallist") {
      const qa = loadLocalQA();
      const count = Object.keys(qa).length;
      return api.sendMessage(`📊 Local Q&A Stats\n✅ Total: ${count} entries\n💡 .bby localteach দিয়ে যোগ করুন!`, threadID, messageID);
    }

    if (args[0] === "remove") {
      const fina = dipto.replace("remove ", "");
      try {
        const dat = (await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`, { timeout: 8000 })).data.message;
        return api.sendMessage(dat, threadID, messageID);
      } catch { return api.sendMessage("❌ API remove failed.", threadID, messageID); }
    }

    if (args[0] === "rm" && dipto.includes("-")) {
      const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
      try {
        const da = (await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${f}`, { timeout: 8000 })).data.message;
        return api.sendMessage(da, threadID, messageID);
      } catch { return api.sendMessage("❌ Remove failed.", threadID, messageID); }
    }

    if (args[0] === "list") {
      try {
        if (args[1] === "all") {
          const data = (await axios.get(`${link}?list=all`, { timeout: 8000 })).data;
          const limited = data?.teacher?.teacherList?.slice(0, parseInt(args[2]) || 10) || [];
          const teachers = await Promise.all(limited.map(async (item) => {
            const number = Object.keys(item)[0];
            const name = await usersData.getName(number).catch(() => number);
            return `${name}: ${item[number]} teaches`;
          }));
          return api.sendMessage(`👑 Top Teachers\n${teachers.join("\n")}`, threadID, messageID);
        } else {
          const d = (await axios.get(`${link}?list=all`, { timeout: 8000 })).data;
          const qa = loadLocalQA();
          return api.sendMessage(
            `📊 BBY Stats\n✅ API Teaches: ${d.length || "offline"}\n📚 Local Q&A: ${Object.keys(qa).length} entries`,
            threadID, messageID
          );
        }
      } catch {
        const qa = loadLocalQA();
        return api.sendMessage(`📊 Local Q&A: ${Object.keys(qa).length} entries (API offline)`, threadID, messageID);
      }
    }

    if (args[0] === "msg") {
      const fuk = dipto.replace("msg ", "");
      try {
        const d = (await axios.get(`${link}?list=${encodeURIComponent(fuk)}`, { timeout: 8000 })).data.data;
        const local = loadLocalQA()[fuk] ? `\n📚 Local: ${loadLocalQA()[fuk].join(", ")}` : "";
        return api.sendMessage(`💬 Replies for "${fuk}":\n${d}${local}`, threadID, messageID);
      } catch {
        const local = loadLocalQA()[fuk];
        if (local) return api.sendMessage(`📚 Local replies: ${local.join(", ")}`, threadID, messageID);
        return api.sendMessage("❌ Not found.", threadID, messageID);
      }
    }

    if (args[0] === "edit") {
      const [, command] = dipto.split(/\s*-\s*/);
      if (!command || command.length < 2) return api.sendMessage("❌ Use: .bby edit [message] - [new reply]", threadID, messageID);
      try {
        const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`, { timeout: 8000 })).data.message;
        return api.sendMessage(`✅ Updated: ${dA}`, threadID, messageID);
      } catch { return api.sendMessage("❌ Edit failed.", threadID, messageID); }
    }

    if (args[0] === "teach" && args[1] !== "react") {
      const [comd, command] = dipto.replace(/^teach\s+amar\s+/, "teach ").split(/\s*-\s*/);
      const final = comd.replace("teach ", "").trim();
      if (!command || command.length < 1) return api.sendMessage("❌ Use: .bby teach [msg] - [reply]\n.bby howto for guide", threadID, messageID);
      try {
        const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${uid}&threadID=${threadID}`, { timeout: 8000 });
        const tex = re.data.message;
        let teacher = uid;
        try { teacher = (await usersData.get(re.data.teacher)).name; } catch {}
        return api.sendMessage(
          `✅ শেখানো হয়েছে!\n📝 "${final}" → ${tex}\n👤 Teacher: ${teacher}\n📊 Total: ${re.data.teachs || "?"}`,
          threadID, messageID
        );
      } catch { return api.sendMessage("❌ API teach failed. Try .bby localteach instead!", threadID, messageID); }
    }

    if (args[0] === "teach" && args[1] === "react") {
      const [comd, command] = dipto.split(/\s*-\s*/);
      const final = comd.replace("teach react ", "").trim();
      if (!command) return api.sendMessage("❌ Use: .bby teach react [msg] - 😍,😂", threadID, messageID);
      try {
        const tex = (await axios.get(`${link}?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(command)}`, { timeout: 8000 })).data.message;
        return api.sendMessage(`✅ Reaction শেখানো হয়েছে: ${tex}`, threadID, messageID);
      } catch { return api.sendMessage("❌ React teach failed.", threadID, messageID); }
    }

    const localReply = getLocalReply(dipto);
    if (localReply) {
      return api.sendMessage(localReply, threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "bby",
          type: "reply",
          messageID: info.messageID,
          author: senderID
        });
      }, messageID);
    }

    try {
      const d = await getApiReply(dipto, uid);
      api.sendMessage(d || "Bolo bby 😊", threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "bby",
          type: "reply",
          messageID: info.messageID,
          author: senderID
        });
      }, messageID);
    } catch {
      const fallbacks = [
        "Hmm, API ta offline! 😅 .bby localteach diye local shikhiye dao!",
        "Network issue! Try again pls 😊", "API unavailable, local mode e achi! 😄"
      ];
      api.sendMessage(fallbacks[Math.floor(Math.random() * fallbacks.length)], threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (api.getCurrentUserID() === event.senderID) return;
    const { threadID, messageID, senderID, body } = event;
    const text = body?.toLowerCase()?.trim() || "";

    const local = getLocalReply(text);
    if (local) {
      return api.sendMessage(local, threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "bby", type: "reply",
          messageID: info.messageID, author: senderID
        });
      }, messageID);
    }

    try {
      const link = `${BASE_API}/baby`;
      const a = (await axios.get(`${link}?text=${encodeURIComponent(text)}&senderID=${senderID}&font=1`, { timeout: 8000 })).data.reply;
      api.sendMessage(a || "😊", threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "bby", type: "reply",
          messageID: info.messageID, author: senderID
        });
      }, messageID);
    } catch {
      api.sendMessage("😊 Bolo!", threadID, messageID);
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    if (!body) return;
    const text = body.toLowerCase().trim();
    const triggers = ["bby ", "bot ", "jan ", "babu ", "janu ", "ghost "];
    const matched = triggers.find(t => text.startsWith(t));
    if (!matched) return;

    const arr = text.replace(matched, "").trim();
    if (!arr) {
      const ran = ["Ji! 😊", "Bolo!", "Ami achi! 👻", "Ki korbo?"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "bby", type: "reply",
          messageID: info.messageID, author: senderID
        });
      }, messageID);
    }

    const local = getLocalReply(arr);
    if (local) {
      return api.sendMessage(local, threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "bby", type: "reply",
          messageID: info.messageID, author: senderID
        });
      }, messageID);
    }

    try {
      const link = `${BASE_API}/baby`;
      const a = (await axios.get(`${link}?text=${encodeURIComponent(arr)}&senderID=${senderID}&font=1`, { timeout: 8000 })).data.reply;
      api.sendMessage(a || "😊 Bolo!", threadID, (err, info) => {
        if (!info) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "bby", type: "reply",
          messageID: info.messageID, author: senderID
        });
      }, messageID);
    } catch {}
  }
};
