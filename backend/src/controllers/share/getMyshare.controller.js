const { QueryCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const ddb = require("../../utils/database");
const TABLE_NAME = 'kua-glang';

const getSharesByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // 1. Get all share items of the user
        const shareData = await ddb.send(new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': `USER#${userId}`,
                ':sk': 'SHARE#'
            }
        }));
        const shares = shareData.Items || [];

        const shareResponses = await Promise.all(
            shares.map(async (share) => {
                const { foodId, available_time, created_at, SK, quantity } = share;
                const shareId = SK.replace('SHARE#', '');

                const folderQuery = await ddb.send(new QueryCommand({
                    TableName: TABLE_NAME,
                    IndexName: 'SKIndex',
                    KeyConditionExpression: 'SK = :sk',
                    ExpressionAttributeValues: {
                        ':sk': `FOOD#${foodId}`
                    },
                    Limit: 1
                }));

                const foodEntry = folderQuery.Items?.[0];
                if (!foodEntry) return null;

                return {
                    shareId,
                    foodId,
                    foodName: foodEntry.foodName,
                    img_url: foodEntry.img_url,
                    expired_at: foodEntry.expired_at,
                    quantity,
                    create_at: created_at,
                    available_time
                };
            })
        );


        //console.log(shares)

        const validShares = shareResponses.filter(Boolean);
        console.log(userId)
        // 3. Get user profile
        const profileData = await ddb.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: `USER#${userId}`,
                SK: 'PROFILE'
            }
        }));



        const profile = profileData.Item || {};
        const { username, profile_url, line_id } = profile;
        
        // 4. Combine and return response
        const fullResponse = validShares.map(share => ({
            ...share,
            username,
            profile_url,
            line_id
        }));
        console.log('✅ Final share object before response:', fullResponse);

        res.json(fullResponse);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports = getSharesByUser;
