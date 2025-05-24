const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");

const followUser = async (req, res) => {
  const { userId, followId } = req.params;

  if (userId === followId) {
    return res.status(400).json({ message: "Cannot follow yourself." });
  }

  try {
    const now = new Date().toISOString();

    await client.send(
      new PutItemCommand({
        TableName: "kua-glang",
        Item: {
          PK: { S: `USER#${userId}` },
          SK: { S: `FOLLOWING#${followId}` },
          type: { S: "Follow" },
          followed_at: { S: now },
        },
      })
    );

    // optional: บันทึก reverse (ผู้ถูกติดตามเป็น follower)
    await client.send(
      new PutItemCommand({
        TableName: "kua-glang",
        Item: {
          PK: { S: `USER#${followId}` },
          SK: { S: `FOLLOWER#${userId}` },
          type: { S: "Follow" },
          followed_at: { S: now },
        },
      })
    );

    return res.status(200).json({ message: "Follow success" });
  } catch (err) {
    console.error("Follow failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = followUser;
