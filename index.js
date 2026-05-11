/**
 * Ghost Bot — by Rakib Islam
 * Ghost Net Edition
 */

const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const log = require("./logger/log.js");

console.log(`\x1b[35m
  ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗    ██████╗  ██████╗ ████████╗
 ██╔════╝ ██║  ██║██╔═══██╗██╔════╝╚══██╔══╝    ██╔══██╗██╔═══██╗╚══██╔══╝
 ██║  ███╗███████║██║   ██║███████╗   ██║       ██████╔╝██║   ██║   ██║   
 ██║   ██║██╔══██║██║   ██║╚════██║   ██║       ██╔══██╗██║   ██║   ██║   
 ╚██████╔╝██║  ██║╚██████╔╝███████║   ██║       ██████╔╝╚██████╔╝   ██║   
  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝       ╚═════╝  ╚═════╝    ╚═╝   
\x1b[36m                   Ghost Net Edition — Owner: Rakib Islam\x1b[0m
`);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve BBY teaching website + owner portfolio
app.use(express.static(path.join(__dirname, "website")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "website", "index.html"));
});

app.get("/status", (req, res) => {
  res.json({
    status: "online",
    bot: "Ghost Bot",
    owner: "Rakib Islam",
    edition: "Ghost Net Edition",
    uptime: Math.floor(process.uptime()) + "s",
    commands: "424+",
    version: require("./package.json").version
  });
});

app.listen(PORT, () => {
  console.log(`\x1b[32m✅ Ghost Bot Server running on port ${PORT}\x1b[0m`);
  console.log(`\x1b[36m🌐 BBY Guide + Portfolio: http://localhost:${PORT}\x1b[0m`);
});

let botProcess = null;
let restartCount = 0;

function startBot() {
  restartCount++;
  console.log(`\x1b[33m🚀 Starting Ghost Bot (attempt ${restartCount})...\x1b[0m`);

  botProcess = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, NODE_ENV: "production" }
  });

  botProcess.on("close", (code) => {
    if (code === 2) {
      log.info("🔄 Ghost Bot restarting in 5s...");
      setTimeout(startBot, 5000);
    } else if (code !== 0) {
      log.info(`Ghost Bot exited with code ${code}. Restarting in 10s...`);
      setTimeout(startBot, 10000);
    } else {
      log.info("Ghost Bot stopped cleanly. Code: " + code);
    }
  });

  botProcess.on("error", (err) => {
    log.info("Ghost Bot process error: " + err.message);
    setTimeout(startBot, 10000);
  });
}

startBot();
