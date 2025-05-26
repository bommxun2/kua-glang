const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const getFoodUsageHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const foldersRes = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": { S: `USER#${userId}` },
          ":sk": { S: "FOLDER#" },
        },
      })
    );

    const folders = foldersRes.Items || [];

    const foodHistories = [];

    for (const folder of folders) {
      const folderId = folder.SK.S.split("#")[1];

      const foodsRes = await dynamoDb.send(
        new QueryCommand({
          TableName: "kua-glang",
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
          FilterExpression: "#status IN (:used, :expired)",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":pk": { S: `FOLDER#${folderId}` },
            ":sk": { S: "FOOD#" },
            ":used": { S: "ใช้ไปแล้ว" },
            ":expired": { S: "หมดอายุ" },
          },
        })
      );

      const foods = foodsRes.Items || [];

      foods.forEach((food) => {
        foodHistories.push({
          username: userId,
          foodName: food.foodName?.S || null,
          created_at: food.created_at?.S || null,
          expired_at: food.expired_at?.S || null,
          use_at: food.use_at?.S || null,
          status: food.status?.S || null,
          img_url: food.img_url?.S || null,
        });
      });
    }

    return res.status(200).json(foodHistories);
  } catch (error) {
    console.error("Error fetching food history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getFoodUsageHistory;
