const client = require("../../utils/database");
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

const likePost = async (req, res) => {
  const { userId, postId } = req.params;
  const like_at = new Date().toISOString();

  const command = new PutCommand({
    TableName: 'kua-glang',
    Item: {
      PK: `POST#${postId}`,
      SK: `LIKE#${userId}`,
      like_at
    },
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
  });

  try {
    await client.send(command);
    res.json({ message: 'like post success' });
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      res.status(400).json({ message: 'You already liked this post.' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = likePost;
