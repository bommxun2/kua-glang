const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const getUserSharePosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const profileRes = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        KeyConditionExpression: "PK = :pk AND SK = :sk",
        ExpressionAttributeValues: {
          ":pk": { S: `USER#${userId}` },
          ":sk": { S: "PROFILE" },
        },
      })
    );

    const username = profileRes.Items?.[0]?.username?.S || "unknown";

    const shareRes = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": { S: `USER#${userId}` },
          ":sk": { S: "SHARE#" },
        },
      })
    );

    const sharePosts = shareRes.Items || [];
    const filteredPosts = sharePosts.filter(
      (item) => item.status?.S === "สำเร็จ" || item.status?.S === "ยกเลิก"
    );

    const results = await Promise.all(
      filteredPosts.map(async (item) => {
        const foodId = item.foodId?.S;

        let foodName = "unknown";
        if (foodId) {
          const foodRes = await dynamoDb.send(
            new QueryCommand({
              TableName: "kua-glang",
              IndexName: "SKIndex",
              KeyConditionExpression: "SK = :sk",
              ExpressionAttributeValues: {
                ":sk": { S: `FOOD#${foodId}` },
              },
            })
          );

          foodName = foodRes.Items?.[0]?.foodName?.S || "unknown";
        }

        return {
          username,
          foodName,
          created_at: item.created_at?.S,
          status: item.status?.S,
        };
      })
    );

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error getting shared posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getUserSharePosts;
