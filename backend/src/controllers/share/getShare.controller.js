const { ScanCommand, QueryCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const client = require("../../utils/database");
const ddb = client;
const TABLE_NAME = 'kua-glang';

const getAllShares = async (req, res) => {
  try {
    // 1. Scan for all SHARE items
    const scanResult = await ddb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':sk': 'SHARE#'
      }
    }));

    const shares = scanResult.Items || [];

    // 2. Map shares to include food + user profile
    const shareResponses = await Promise.all(
      shares.map(async (share) => {
        const { foodId, available_time, created_at, SK, PK, quantity } = share;
        const shareId = SK.replace('SHARE#', '');
        const userId = PK.replace('USER#', '');

        // Fetch food info
        const foodQuery = await ddb.send(new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: 'SKIndex',
          KeyConditionExpression: 'SK = :sk',
          ExpressionAttributeValues: {
            ':sk': `FOOD#${foodId}`
          },
          Limit: 1
        }));
        const foodEntry = foodQuery.Items?.[0];
        if (!foodEntry) return null;

        // Fetch user profile
        const profileData = await ddb.send(new GetCommand({
          TableName: TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: 'PROFILE'
          }
        }));
        const profile = profileData.Item || {};

        return {
          shareId,
          foodId,
          foodName: foodEntry.foodName,
          img_url: foodEntry.img_url,
          expired_at: foodEntry.expired_at,
          quantity,
          create_at: created_at,
          available_time,
          username: profile.username,
          profile_url: profile.profile_url,
          line_id: profile.line_id
        };
      })
    );

    const validShares = shareResponses.filter(Boolean);
    res.json(validShares);

  } catch (err) {
    console.error('Error fetching all shares:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

module.exports = getAllShares;
