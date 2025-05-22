const dynamoDb = require("../../utils/database");
const { QueryCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const receive = async (req, res) => {
  const { userId } = req.params("userId");

  try {
    const receive =
      (await dynamoDb.send(
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
      )) || [];

    const result = [];
    return res.status(200).json(receive);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

module.exports = receive;
