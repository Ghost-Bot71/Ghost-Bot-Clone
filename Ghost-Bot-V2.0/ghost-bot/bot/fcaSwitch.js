/**
 * Dual FCA Switch System
 * Ghost Bot — Rakib Islam | Ghost Net Edition
 * Switch between: fb-chat-api (built-in) OR fca-unofficial (npm)
 */

const fs = require("fs-extra");
const path = require("path");

function getFCA() {
  let config = {};
  try {
    config = fs.readJsonSync(path.join(__dirname, "../config.json"));
  } catch (e) {}

  const mode = (config.fcaMode || "fb-chat-api").toLowerCase();

  if (mode === "fca-unofficial") {
    try {
      const fca = require("@xaviabot/fca-unofficial");
      console.log("\x1b[36m[FCA-SWITCH] Using: fca-unofficial (@xaviabot)\x1b[0m");
      return fca;
    } catch (e) {
      console.warn("\x1b[33m[FCA-SWITCH] fca-unofficial not found, falling back to fb-chat-api\x1b[0m");
    }
  }

  console.log("\x1b[32m[FCA-SWITCH] Using: fb-chat-api (built-in)\x1b[0m");
  return require("../fb-chat-api");
}

module.exports = { getFCA };
