const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const params = {
    TableName: "kua-glang",
    Key: {
      PK: { S: `USER#${username}` },
      SK: { S: "PROFILE" },
    },
  };

  try {
    const data = await client.send(new GetItemCommand(params));
    if (!data.Item || data.Item.password.S !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: username,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = login;
