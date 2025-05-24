const { DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");

const unfollowUser = async (req, res) => {
  const { userId, followId } = req.params;

  if (userId === followId) {
    return res.status(400).json({ message: "Cannot unfollow yourself." });
  }

  try {
    // ลบจาก FOLLOWING
    await client.send(
      new DeleteItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: `USER#${userId}` },
          SK: { S: `FOLLOWING#${followId}` },
        },
      })
    );

    // optional: ลบจาก FOLLOWER (ของฝั่ง followId)
    await client.send(
      new DeleteItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: `USER#${followId}` },
          SK: { S: `FOLLOWER#${userId}` },
        },
      })
    );

    return res.status(200).json({ message: "Unfollow success" });
  } catch (err) {
    console.error("Unfollow failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = unfollowUser;
