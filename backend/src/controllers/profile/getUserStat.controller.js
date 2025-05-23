const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const getUserStat = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await dynamoDb.send(
      new GetItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: `USER#${userId}` },
          SK: { S: "STAT" },
        },
      })
    );

    const item = result.Item;

    if (!item) {
      return res.status(404).json({ error: "Stat not found" });
    }

    const stat = {
      share_quantity: item.share_quantity?.N || item.share_quantity?.S || "0",
      reduce_foodwaste:
        item.reduce_foodwaste?.N || item.reduce_foodwaste?.S || "0",
      no_expired: item.no_expired?.N || item.no_expired?.S || "0",
    };

    return res.status(200).json(stat);
  } catch (error) {
    console.error("Error getting user stat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getUserStat;
