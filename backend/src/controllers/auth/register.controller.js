const { PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");
const { nanoid } = require("nanoid");
const {
  SNSClient,
  CreateTopicCommand,
  SubscribeCommand,
} = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({ region: "us-east-1" });

const register = async (req, res) => {
  const { username, email, phone_num, line_id, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // เช็กว่ามีอยู่แล้วหรือยัง
  const checkParams = {
    TableName: "kua-glang",
    Key: {
      PK: { S: `USER#${username}` },
      SK: { S: "PROFILE" },
    },
  };

  const existing = await client.send(new GetItemCommand(checkParams));
  if (existing.Item) {
    return res.status(409).json({ error: "Username already exists" });
  }

  const userId = nanoid(4);

  const createdAt = new Date().toISOString();
  const item = {
    PK: { S: `USER#${username}` },
    SK: { S: "PROFILE" },
    username: { S: username },
    email: { S: email },
    phone: { S: phone_num || "" },
    line: { S: line_id || "" },
    password: { S: password },
    created_at: { S: createdAt },
  };

  try {
    await client.send(
      new PutItemCommand({
        TableName: "kua-glang",
        Item: item,
      })
    );

    const topicName = "kua-notification-topic";
    const createTopicRes = await snsClient.send(
      new CreateTopicCommand({ Name: topicName })
    );

    const topicArn = createTopicRes.TopicArn;

    await snsClient.send(
      new SubscribeCommand({
        Protocol: "email",
        TopicArn: topicArn,
        Endpoint: email,
      })
    );

    res.status(201).json({ message: "register success" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "register user error" });
  }
};

module.exports = register;
