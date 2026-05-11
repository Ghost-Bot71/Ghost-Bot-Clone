const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["bbyhelp", "bbybot", "bbabe", "sam"],
    version: "7.0.0",
    author: "Rakib Islam",
    countDown: 0,
    role: 0,
    description: "Ghost Bot AI Chat — teach, chat, and interact",
    category: "chat",
    guide: {
        en: [
            "{pn} [anyMessage] — chat with Ghost Bot",
            "{pn} teach [YourMessage] - [Reply1], [Reply2] — teach a response",
            "{pn} teach react [YourMessage] - [react1], [react2] — teach a reaction",
            "{pn} remove [YourMessage] — remove a taught message",
            "{pn} rm [YourMessage] - [indexNumber] — remove specific reply",
            "{pn} msg [YourMessage] — check stored replies",
            "{pn} list — total teaches count",
            "{pn} list all [limit] — leaderboard of teachers",
            "{pn} edit [YourMessage] - [NewMessage] — edit a response",
            "{pn} howto — show teaching tutorial",
        ].join("\n")
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo bby 😊", "Ji bolo!", "Ami achi, ki dorkar?", "Bolo jaan ki korte paro", "Bolun, shunte achi 👂"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        // Teaching tutorial / how-to guide
        if (args[0] === 'howto' || args[0] === 'help' || args[0] === 'tutorial') {
            const tutorial = `👻 Ghost Bot — BBY Teaching Guide

📌 HOW TO TEACH:
┌─────────────────────────────
│ .bby teach [message] - [reply]
│ Example:
│ .bby teach hello - Hi there!, Hey!, Hello!
└─────────────────────────────

📌 MULTIPLE REPLIES:
│ Separate replies with commas (,)
│ .bby teach how are you - I'm good!, Fine thanks!, Great!

📌 TEACH REACTIONS:
│ .bby teach react [message] - 😍,😂,❤️
│ Example:
│ .bby teach react good morning - 🌅,😊,👋

📌 REMOVE A TEACH:
│ .bby remove [message]
│ .bby rm [message] - [index]

📌 CHECK REPLIES:
│ .bby msg [message]

📌 EDIT A REPLY:
│ .bby edit [message] - [new reply]

📌 STATS:
│ .bby list — total teaches
│ .bby list all — top teachers

🌐 Full guide: https://ghost-bot-bby.onrender.com
👑 Owner: Rakib Islam`;

            return api.sendMessage(tutorial, event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit);
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Unknown";
                    return { name, value };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}. ${t.name}: ${t.value} teaches`).join('\n');
                return api.sendMessage(`👑 Ghost Bot — Top Teachers\nTotal Teaches: ${data.length}\n\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`📊 Ghost Bot BBY Stats\n✅ Total Teaches: ${d.length || "API offline"}\n💬 Total Replies: ${d.responseLength || "API offline"}\n\nLearn to teach: .bby howto`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`💬 Replies for "${fuk}":\n${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(/\s*-\s*/)[1];
            if (!command || command.length < 2) return api.sendMessage('❌ Invalid format! Use: .bby edit [message] - [new reply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`✅ Updated: ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ Invalid format!\nUse: .bby teach [message] - [reply]\nExample: .bby teach hello - Hi there!\n\nFor help: .bby howto', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Teach Added!\n📝 Message: ${final}\n💬 Reply: ${tex}\n👤 Teacher: ${teacher}\n📊 Total Teaches: ${re.data.teachs}\n\nWant to learn more? Type: .bby howto`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Personal teach added: ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ Invalid format!\nUse: .bby teach react [message] - 😍,😂,❤️', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Reaction teach added: ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            if (!info) return;
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        return api.sendMessage("❌ BBY service error. Try again later!", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
    if ([api.getCurrentUserID()].includes(event.senderID)) return;
    try {
        if (event.type == "message_reply") {
            const link = `${await baseApiUrl()}/baby`;
            const a = (await axios.get(`${link}?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                if (!info) return;
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : "";
        if (body.startsWith("bbyhelp") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
            const arr = body.replace(/^\S+\s*/, "");
            const link = `${await baseApiUrl()}/baby`;
            const randomReplies = ["😚", "Yes, ami achi!", "What's up?", "Bolo jaan", "Shunte achi 👂"];
            if (!arr) {
                return api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) return;
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID);
            }
            const a = (await axios.get(`${link}?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                if (!info) return;
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
};
