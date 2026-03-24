const { PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");
const { nanoid } = require("nanoid");

const register = async (req, res) => {
  const { username, email, phone_num, line_id, password, profile_url } =
    req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if user already exists
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

  const profileItem = {
    PK: { S: `USER#${username}` },
    SK: { S: "PROFILE" },
    username: { S: username },
    email: { S: email },
    phone: { S: phone_num || "" },
    line: { S: line_id || "" },
    password: { S: password },
    created_at: { S: createdAt },
    profile_url: { S: profile_url || "" },
  };

  const statItem = {
    PK: { S: `USER#${username}` }, // ใช้ username เป็น userId ใน PK
    SK: { S: "STAT" },
    share_quantity: { N: "0" },
    reduce_foodwaste: { N: "0" },
    no_expired: { N: "0" },
    updated_at: { S: createdAt },
  };

  try {
    // Save PROFILE
    await client.send(
      new PutItemCommand({
        TableName: "kua-glang",
        Item: profileItem,
      })
    );

    // Save STAT
    await client.send(
      new PutItemCommand({
        TableName: "kua-glang",
        Item: statItem,
      })
    );

    res.status(201).json({ message: "register success" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "register user error" });
  }
};

module.exports = register;
