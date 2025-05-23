const {
  GetItemCommand,
  UpdateItemCommand,
  PutItemCommand,
} = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const completeQuest = async (req, res) => {
  const { userId, qId } = req.params;

  try {
    const questRes = await dynamoDb.send(
      new GetItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: `QUEST#${qId}` },
          SK: { S: "DETAILS" },
        },
      })
    );

    if (!questRes.Item) {
      return res.status(404).json({ message: "Quest not found" });
    }

    const reward = parseInt(questRes.Item.reward_pointt?.N || "0");

    await dynamoDb.send(
      new UpdateItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: `USER#${userId}` },
          SK: { S: "PROFILE" },
        },
        UpdateExpression: "SET score = if_not_exists(score, :zero) + :inc",
        ExpressionAttributeValues: {
          ":inc": { N: reward.toString() },
          ":zero": { N: "0" },
        },
      })
    );

    await dynamoDb.send(
      new PutItemCommand({
        TableName: "kua-glang",
        Item: {
          PK: { S: `USER#${userId}` },
          SK: { S: `QUEST#${qId}` },
          success_at: { S: new Date().toISOString() },
        },
      })
    );

    return res
      .status(200)
      .json({ message: "Quest completed and score updated" });
  } catch (error) {
    console.error("Error completing quest:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = completeQuest;
