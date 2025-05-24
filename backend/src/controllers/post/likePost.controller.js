const AWS = require('aws-sdk');
const client = require("../../utils/database");

const likePost = async (req, res) => {
  const { userId, postId } = req.params;
  const like_at = new Date().toISOString();

  const params = {
    TableName: 'kua-glang',
    Item: {
      PK: `POST#${postId}`,
      SK: `LIKE#${userId}`,
      like_at
    },
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
  };

  try {
    await client.put(params).promise();
    res.json({ message: 'like post success' });
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      res.status(400).json({ message: 'You already liked this post.' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports =  likePost ;