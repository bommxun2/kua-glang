const { nanoid } = require('nanoid');
const client = require("../../utils/database");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = 'kua-glang'; 

const commentPost = async (req, res) => {
  const { postId, userId } = req.params;
  const { caption } = req.body;

  if (!caption) {
    return res.status(400).json({ message: 'caption is required' });
  }

  const cId = nanoid(4);
  const comment_at = new Date().toISOString();

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      PK: `POST#${postId}`,
      SK: `COMMENT#${cId}`,
      userId,
      caption,
      comment_at
    }
  });

  try {
    await client.send(command);
    res.status(200).json({
      cId,
      message: 'comment success',
      caption
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = commentPost;
