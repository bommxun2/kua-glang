const express = require("express");
const awsServerlessExpress = require("aws-serverless-express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: ".env" });

const app = express();
const port = 3000;
const server = awsServerlessExpress.createServer(app);

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.route");
app.use(authRoutes);
app.use("/post", require("./routes/post.route"));
app.use("/share", require("./routes/share.route"));
app.use("/profile", require("./routes/profile.route"));
app.use("/history", require("./routes/history.route"));
app.use("/ranking", require("./routes/rank.route"));
app.use("/folder", require("./routes/folder.route"));
app.use("/food", require("./routes/food.route"));
app.use("/image", require("./routes/api.route"));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend service Lambda Express on.",
    serviceName: "KuaGlangAPI",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Backend service listening on port ${port}`);
});

exports.handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);
