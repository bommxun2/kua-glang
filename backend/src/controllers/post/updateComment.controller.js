const { UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");

const updateComment = async (req, res) => {
  const { postId, cId } = req.params;
  const { content } = req.body;

  try {
    await client.send(
      new UpdateItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: `POST#${postId}` },
          SK: { S: `COMMENT#${cId}` },
        },
        UpdateExpression: "SET content = :content",
        ExpressionAttributeValues: {
          ":content": { S: content },
        },
      })
    );

    return res.json({
      message: "comment success",
      content,
    });
  } catch (err) {
    console.error("Update comment failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updateComment;
