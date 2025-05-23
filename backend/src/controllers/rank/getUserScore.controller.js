const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const getUserScore = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await dynamoDb.send(
      new GetItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: `USER#${userId}` },
          SK: { S: "PROFILE" },
        },
        ProjectionExpression: "score", // ดึงเฉพาะฟิลด์ score
      })
    );

    if (!result.Item || !result.Item.score) {
      return res
        .status(404)
        .json({ message: "User not found or score missing" });
    }

    const score = parseInt(result.Item.score.N, 10);

    return res.status(200).json({ userId, score });
  } catch (error) {
    console.error("Error fetching score:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getUserScore;
