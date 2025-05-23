const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const getReceivedShares = async (req, res) => {
  const { userId } = req.params;

  try {
    const receiveRes = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        IndexName: "SKIndex",
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
          ":sk": { S: `RECEIVE#${userId}` },
        },
      })
    );

    const receiveItems = receiveRes.Items || [];

    const result = await Promise.all(
      receiveItems.map(async (receive) => {
        const shareId = receive.PK.S.split("#")[1];

        const sharePostRes = await dynamoDb.send(
          new QueryCommand({
            TableName: "kua-glang",
            KeyConditionExpression: "PK = :pk AND SK = :sk",
            ExpressionAttributeValues: {
              ":pk": { S: `USER#${shareId.split("-")[0]}` },
              ":sk": { S: `SHARE#${shareId}` },
            },
          })
        );

        const sharePost = sharePostRes.Items?.[0];
        if (!sharePost) return null;

        const status = sharePost.status?.S;
        if (status !== "สำเร็จ" && status !== "ยกเลิก") return null;

        const foodId = sharePost.foodId?.S;

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

        const ownerId = sharePost.PK.S.split("#")[1];
        const userRes = await dynamoDb.send(
          new QueryCommand({
            TableName: "kua-glang",
            KeyConditionExpression: "PK = :pk AND SK = :sk",
            ExpressionAttributeValues: {
              ":pk": { S: `USER#${ownerId}` },
              ":sk": { S: "PROFILE" },
            },
          })
        );

        const username = userRes.Items?.[0]?.username?.S || "unknown";

        return {
          username,
          foodName,
          created_at: sharePost.created_at?.S,
          status,
        };
      })
    );

    const filtered = result.filter((item) => item !== null);

    return res.status(200).json(filtered);
  } catch (error) {
    console.error("Error fetching received shares:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getReceivedShares;
