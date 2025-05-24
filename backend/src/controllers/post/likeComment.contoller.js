const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'kua-glang'; 

const likeComment = async (req, res) => {
  const { cid, userId } = req.params;
  const liked_At = new Date().toISOString();

  if (!cid) {
    return res.status(400).json({ message: 'cid (comment ID) is required' });
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: `COMMENT#${cid}`,
      SK: `LIKE#${userId}`,
      liked_At
    },
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(200).json({ message: 'like post success' });
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      res.status(400).json({ message: 'You already liked this comment.' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = likeComment;