const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.WEBSITE_PORT || 3002;

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`\x1b[36m👻 Ghost Bot Website running on port ${PORT}\x1b[0m`);
});
