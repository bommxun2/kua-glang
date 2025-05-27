const express = require("express");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: ".env" });

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString("utf8"));
    } catch (err) {
      console.error("Error parsing body buffer:", err);
    }
  }
  next();
});

app.use("/auth", require("./routes/auth.route"));
app.use("/post", require("./routes/post.route"));
app.use("/share", require("./routes/share.route"));
app.use("/profile", require("./routes/profile.route"));
app.use("/history", require("./routes/history.route"));
app.use("/ranking", require("./routes/rank.route"));
app.use("/folder", require("./routes/folder.route"));
app.use("/food", require("./routes/food.route"));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend service Lambda Express on.",
    serviceName: "KuaGlangAPI",
    timestamp: new Date().toISOString(),
  });
});

module.exports.handler = serverless(app, {
  basePath: "/kua-api",
});
