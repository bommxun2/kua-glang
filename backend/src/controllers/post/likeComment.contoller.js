
const client = require("../../utils/database");
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = 'kua-glang';

const likeComment = async (req, res) => {
  const { cId, userId } = req.params;
  const liked_At = new Date().toISOString();

  if (!cId) {
    return res.status(400).json({ message: 'cId (comment ID) is required' });
  }

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      PK: `COMMENT#${cId}`,
      SK: `LIKE#${userId}`,
      liked_At
    },
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
  });

  try {
    await client.send(command);
    res.status(200).json({ message: 'like comment success' });
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      res.status(400).json({ message: 'You already liked this comment.' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = likeComment;
