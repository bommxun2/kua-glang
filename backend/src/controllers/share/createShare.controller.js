const { PutItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const client = require("../../utils/database");
const { nanoid } = require('nanoid');

const createShareFood = async (req, res) => {
    const { userId, foodId } = req.params;
    const {
        quantity,
        latitude,
        longtitude,
        available_time,
        status
    } = req.body;

    try {

        const folderResult = await client.send(new QueryCommand({
            TableName: 'kua-glang',
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': { S: `USER#${userId}` },
                ':sk': { S: 'FOLDER#' }
            }
        }));


        if (!folderResult.Items || folderResult.Items.length === 0) {
            return res.status(404).json({ error: 'No folder found for this user.' });
        }

        let found = false;
        let folderId = null;
        let foodItemDetails = null;

        for (const item of folderResult.Items) {
            const folderKey = item.SK?.S || item.FK?.S;
            if (folderKey?.startsWith('FOLDER#')) {
                const currentFolderId = folderKey.split('#')[1];

                const foodCheck = await client.send(new QueryCommand({
                    TableName: 'kua-glang',
                    KeyConditionExpression: 'PK = :pk AND SK = :sk',
                    ExpressionAttributeValues: {
                        ':pk': { S: `FOLDER#${currentFolderId}` },
                        ':sk': { S: `FOOD#${foodId}` }
                    }
                }));

                if (Array.isArray(foodCheck.Items) && foodCheck.Items.length > 0) {
                    found = true;
                    folderId = currentFolderId;
                    foodItemDetails = foodCheck.Items[0];
                    break;
                }
            }
        }


        if (!found || !foodItemDetails) {
            return res.status(404).json({ error: 'Food item not found in any folder of this user.' });
        }

        if (!quantity || !latitude || !longtitude || !available_time || !status) {
            return res.status(400).json({ error: 'Missing required fields in request body' });
        }


        const shareId = nanoid(4);
        const createdAt = new Date().toISOString();

        const foodName = foodItemDetails.foodName?.S || '';
        const img_url = foodItemDetails.img_url?.S || '';
        const unit = foodItemDetails.unit?.S || '';
        const expired_at = foodItemDetails.expired_at?.S || '';

        const shareItem = {
            PK: { S: `USER#${userId}` },
            SK: { S: `SHARE#${shareId}` },
            foodId: { S: foodId },
            quantity: { N: quantity.toString() },
            latitude: { S: latitude },
            longtitude: { S: longtitude },
            available_time: { S: available_time },
            status: { S: status },
            created_at: { S: createdAt }
        };

        await client.send(new PutItemCommand({
            TableName: 'kua-glang',
            Item: shareItem
        }));

        res.json({
            shareId,
            foodName,
            img_url,
            unit,
            expired_at,
            quantity,
            latitude,
            longtitude,
            available_time,
            status
        });

    } catch (err) {
        console.error('Share food error:', err);
        res.status(500).json({ error: 'Failed to share food' });
    }
};

module.exports = createShareFood;
