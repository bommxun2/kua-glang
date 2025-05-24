const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const docClient = require('../../utils/database');

const addInterest = async (req, res) => {
  const { shareId, userId } = req.params;
  const { username } = req.body;

  const timestamp = new Date().toISOString();

  const params = {
    TableName: 'kua-glang',
    Item: {
      PK: `SHARE#${shareId}`,
      SK: `INTEREST#${userId}`,
      interested_at: timestamp,
      username
    }
  };

  try {
    await docClient.send(new PutCommand(params));

    res.status(201).json({
      userId,
      username,
      interested_at: timestamp
    });
  } catch (error) {
    console.error('Error saving interest:', error);
    res.status(500).json({ error: 'Failed to save interest' });
  }
};

module.exports = addInterest;
