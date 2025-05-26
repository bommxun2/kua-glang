const dynamoDb = require("../../utils/database");
const { QueryCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const receive = async (req, res) => {
  const { userId } = req.params;

  try {
    const receive = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        IndexName: "SKIndex",
        KeyConditionExpression: "SK = :sk",
        FilterExpression: "begins_with(PK, :pkPrefix)",
        ExpressionAttributeValues: {
          ":sk": { S: `RECEIVE#${userId}` },
          ":pkPrefix": { S: "SHARE#" },
        },
      })
    );

    const result = [];
    for (const recv of receive.Items) {
      const shareId = recv.PK.S;
      const share = await dynamoDb.send(
        new QueryCommand({
          TableName: "kua-glang",
          IndexName: "SKIndex",
          KeyConditionExpression: "SK = :shareId",
          ExpressionAttributeValues: {
            ":shareId": { S: `${shareId}` },
          },
        })
      );

      const userId = share.Items[0].PK.S;
      const user = await dynamoDb.send(
        new GetItemCommand({
          TableName: "kua-glang",
          Key: {
            PK: { S: `${userId}` },
            SK: { S: "PROFILE" },
          },
        })
      );

      const foodId = share.Items[0].foodId.S;
      const food = await dynamoDb.send(
        new QueryCommand({
          TableName: "kua-glang",
          IndexName: "SKIndex",
          KeyConditionExpression: "SK = :sk",
          ExpressionAttributeValues: {
            ":sk": { S: `FOOD#${foodId}` },
          },
        })
      );

      const userData = unmarshall(user.Item);
      const shareData = unmarshall(share.Items[0]);
      const foodData = unmarshall(food.Items[0]);

      result.push({
        username: userData.username,
        accepted_at: recv.accepted_at.S,
        foodName: foodData.foodName,
        img_url: foodData.img_url,
        expired_at: foodData.expired_at,
        quantity: shareData.quantity,
        latitude: shareData.latitude,
        longtitude: shareData.longtitude,
        lineId: userData.line_id,
        avaliable_time: shareData.avaliable_time,
        profile_image_url: userData.profile_url,
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
};

module.exports = receive;
