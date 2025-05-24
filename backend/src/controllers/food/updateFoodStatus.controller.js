const { QueryCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");

const updateFoodStatus = async (req, res) => {
  const { foodId } = req.params;

  try {
    // 1. Query จาก foodId เพื่อหาคู่ PK / SK
    const foodRes = await client.send(
      new QueryCommand({
        TableName: "kua-glang",
        IndexName: "SKIndex",
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
          ":sk": { S: `FOOD#${foodId}` },
        },
      })
    );

    if (!foodRes.Items || foodRes.Items.length === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    const item = foodRes.Items[0];
    const PK = item.PK.S;
    const SK = item.SK.S;

    // 2. Update status และ use_at
    const now = new Date().toISOString();

    await client.send(
      new UpdateItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: PK },
          SK: { S: SK },
        },
        UpdateExpression: "SET #status = :used, #use_at = :now",
        ExpressionAttributeNames: {
          "#status": "status",
          "#use_at": "use_at",
        },
        ExpressionAttributeValues: {
          ":used": { S: "ใช้ไปแล้ว" },
          ":now": { S: now },
        },
      })
    );

    return res.status(200).json({ message: "update food success" });
  } catch (err) {
    console.error("Update food status failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateFoodStatus;
