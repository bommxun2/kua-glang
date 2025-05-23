const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await dynamoDb.send(
      new GetItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: `USER#${userId}` },
          SK: { S: "PROFILE" },
        },
      })
    );

    const item = result.Item;

    if (!item) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = {
      username: item.username?.S || "",
      email: item.email?.S || "",
      phone_num: item.phone_num?.S || "",
      line_id: item.line_id?.S || "",
      profile_url: item.profile_url?.S || "",
      bio: item.bio?.S || "",
    };

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getUserProfile;
