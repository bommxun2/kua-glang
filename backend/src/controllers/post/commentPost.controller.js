
const { nanoid } = require('nanoid');
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const client = require("../../utils/database");
const dynamoDB = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'kua-glang'; 

const commentPost = async (req, res) => {
  const { postId, userId } = req.params;
  const { caption } = req.body;

  if (!caption) {
    return res.status(400).json({ message: 'caption is required' });
  }

  const cId = nanoid(4);
  const comment_at = new Date().toISOString();

  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: `POST#${postId}`,
      SK: `COMMENT#${cId}`,
      userId,
      caption,
      comment_at
    }
  };

  try {
    await dynamoDB.put(params).promise();
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