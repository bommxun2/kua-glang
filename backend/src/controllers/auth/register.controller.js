const { PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");

const register = async (req, res) => {
  const { username, email, phone, line, password } = req.body;

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

  const createdAt = new Date().toISOString();
  const item = {
    PK: { S: `USER#${username}` },
    SK: { S: "PROFILE" },
    username: { S: username },
    email: { S: email },
    phone: { S: phone || "" },
    line: { S: line || "" },
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

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
};

module.exports = register;
