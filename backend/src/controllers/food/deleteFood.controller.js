const dynamoDb = require("../../utils/database");
const { QueryCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const deleteFood = async (req, res) => {
  const { foodId } = req.params;

  try {
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

    if (!foodRes.Items || foodRes.Items.length === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    const item = foodRes.Items[0];
    const PK = item.PK.S;
    const SK = item.SK.S;

    await dynamoDb.send(
      new DeleteItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: PK },
          SK: { S: SK },
        },
      })
    );

    return res.status(200).json({ message: "delete food success" });
  } catch (err) {
    console.error("Delete food failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = deleteFood;
