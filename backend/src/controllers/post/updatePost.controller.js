const { UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const client = require("../../utils/database");

const updatePost = async (req, res) => {
  const { userId, postId } = req.params;
  const { caption, img_url } = req.body;

  if (!caption || !img_url) {
    return res.status(400).json({ error: 'caption and img_url are required' });
  }

  const params = {
    TableName: 'kua-glang',
    Key: {
      PK: { S: `USER#${userId}` },
      SK: { S: `POST#${postId}` },
    },
    UpdateExpression: 'SET caption = :caption, img_url = :img_url',
    ExpressionAttributeValues: {
      ':caption': { S: caption },
      ':img_url': { S: img_url },
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    await client.send(new UpdateItemCommand(params));

    res.json({
      postId,
      caption,
      img_url,
    });
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

module.exports = updatePost;