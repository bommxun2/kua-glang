const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const getRanking = async (req, res) => {
  const { userId } = req.params;
  const { rankingType, number } = req.query;

  const limit = parseInt(number) || 10;

  const validTypes = {
    share_quantity: "ครั้ง",
    reduce_foodwaste: "KG",
    no_expired: "KG",
  };

  if (!validTypes[rankingType]) {
    return res.status(400).json({ message: "Invalid ranking type" });
  }

  try {
    // Step 1: Query all user stats
    const allStatsRes = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        IndexName: "SKIndex",
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
          ":sk": { S: "STAT" },
        },
      })
    );

    const stats = (allStatsRes.Items || []).map((item) => ({
      userId: item.PK.S.split("#")[1],
      quantity: parseInt(item[rankingType]?.N || "0", 10),
    }));

    // Step 2: Sort all users by quantity descending
    const sorted = stats
      .sort((a, b) => b.quantity - a.quantity)
      .map((item, index) => ({
        ...item,
        position: (index + 1).toString(),
      }));

    // Step 3: Slice top N
    const topN = sorted.slice(0, limit);

    // Step 4: Check if self is in topN
    const self = sorted.find((item) => item.userId === userId);

    const includeSelf = self && !topN.some((u) => u.userId === userId);

    // Step 5: Enrich with profile
    const enrich = async (entry) => {
      const profileRes = await dynamoDb.send(
        new QueryCommand({
          TableName: "kua-glang",
          KeyConditionExpression: "PK = :pk AND SK = :sk",
          ExpressionAttributeValues: {
            ":pk": { S: `USER#${entry.userId}` },
            ":sk": { S: "PROFILE" },
          },
        })
      );

      const profile = profileRes.Items?.[0] || {};

      return {
        position: entry.position,
        username: profile.username?.S || "unknown",
        profile_img: profile.profile_url?.S || "",
        quantity: entry.quantity.toString(),
        unit: validTypes[rankingType],
      };
    };

    const result = await Promise.all(topN.map(enrich));

    // Step 6: Append self if not already included
    if (includeSelf) {
      const selfEnriched = await enrich(self);
      result.push(selfEnriched);
    }

    // Step 7: Return in correct format key
    return res.status(200).json({
      [rankingType === "share_quantity"
        ? "share"
        : rankingType === "reduce_foodwaste"
        ? "food_waste"
        : "eat_expried"]: result,
    });
  } catch (error) {
    console.error("Error in getRankingWithSelf:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getRanking;
