const { DeleteItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");

const client = require("../../utils/database");

const deleteComment = async (req, res) => {
  const { postId, cId } = req.params;

  try {
    await client.send(
      new DeleteItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: `POST#${postId}` },
          SK: { S: `COMMENT#${cId}` },
        },
      })
    );

    const likesOnComment = await client.send(
      new QueryCommand({
        TableName: "kua-glang",
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": { S: `COMMENT#${cId}` },
        },
      })
    );

    for (const item of likesOnComment.Items) {
      await client.send(
        new DeleteItemCommand({
          TableName: "kua-glang",
          Key: {
            PK: { S: `COMMENT#${cId}` },
            SK: { S: item.SK.S },
          },
        })
      );
    }

    return res.json({
      message: "delete comment success",
    });
  } catch (err) {
    console.error("Delete comment failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deleteComment;
