const { ScanCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");

exports.handler = async (event) => {
  try {
    const now = new Date();

    // 1. Scan หาอาหารที่ยังไม่ถูกใช้
    const foodScan = await client.send(
      new ScanCommand({
        TableName: "kua-glang",
        FilterExpression: "begins_with(SK, :food) AND #status = :notUsed",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":food": { S: "FOOD#" },
          ":notUsed": { S: "ยังไม่ถูกใช้" },
        },
      })
    );

    const expiredFoods = foodScan.Items.filter((item) => {
      const expiredAt = item.expired_at?.S;
      return expiredAt && new Date(expiredAt) <= now;
    });

    const updatePromises = expiredFoods.map((food) => {
      const PK = food.PK.S;
      const SK = food.SK.S;

      return client.send(
        new UpdateItemCommand({
          TableName: "kua-glang",
          Key: { PK: { S: PK }, SK: { S: SK } },
          UpdateExpression: "SET #status = :expired",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":expired": { S: "หมดอายุ" },
          },
        })
      );
    });

    await Promise.all(updatePromises);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Updated ${expiredFoods.length} expired food items.`,
      }),
    };
  } catch (error) {
    console.error("Error expiring foods:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    };
  }
};
