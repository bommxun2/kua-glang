const express = require("express");
const awsServerlessExpress = require("aws-serverless-express");

const app = express();
const port = 3000;
const server = awsServerlessExpress.createServer(app);

app.use(express.json());

app.use("/share", require("./routes/post.route"))

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
