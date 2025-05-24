const { QueryCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const docClient = require("../../utils/database");


const getShareInterest = async (req, res) => {
  const { shareId, userId } = req.params;

  try {

    const checkOwnershipParams = {
      TableName: 'kua-glang',
      Key: {
        PK: `USER#${userId}`,
        SK: `SHARE#${shareId}`
      }
    };

    const shareItem = await docClient.send(new GetCommand(checkOwnershipParams));
    if (!shareItem.Item) {
      return res.status(403).json({ error: 'Forbidden: Not the owner of this share' });
    }

    const interestParams = {
      TableName: 'kua-glang',
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `SHARE#${shareId}`,
        ':sk': 'INTEREST#'
      }
    };

    const data = await docClient.send(new QueryCommand(interestParams));

    const results = data.Items.map(item => ({
      userId: item.SK.replace('INTEREST#', ''),
      username: item.username,
      interested_at: item.interested_at,
      profile_image_url: item.profile_image_url
    }));

    res.json(results);
  } catch (error) {
    console.error('Error querying DynamoDB:', error);
    res.status(500).json({ error: 'Failed to fetch interest data' });
  }
};

module.exports = getShareInterest;
