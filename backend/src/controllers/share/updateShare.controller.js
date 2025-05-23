const { UpdateItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const client = require("../../utils/database");

const updateShare = async (req, res) => {
    const { userId, foodId, shareId } = req.params;
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
        let foodItemDetails = null;

        for (const item of folderResult.Items) {
            const folderKey = item.SK?.S;
            if (folderKey?.startsWith("FOLDER#")) {
                const folderId = folderKey.split("#")[1];

                const foodResult = await client.send(new QueryCommand({
                    TableName: 'kua-glang',
                    KeyConditionExpression: 'PK = :pk AND SK = :sk',
                    ExpressionAttributeValues: {
                        ':pk': { S: `FOLDER#${folderId}` },
                        ':sk': { S: `FOOD#${foodId}` }
                    }
                }));

                if (foodResult.Items?.length > 0) {
                    foodItemDetails = foodResult.Items[0];
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            return res.status(404).json({ error: 'Food not found' });
        }


        await client.send(new UpdateItemCommand({
            TableName: 'kua-glang',
            Key: {
                PK: { S: `USER#${userId}` },
                SK: { S: `SHARE#${shareId}` }
            },
            UpdateExpression: `
    SET #foodId = :foodId,
        #quantity = :quantity,
        #latitude = :latitude,
        #longtitude = :longtitude,
        #available_time = :available_time,
        #status = :status
  `,
            ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
            ExpressionAttributeNames: {
                '#foodId': 'foodId',
                '#quantity': 'quantity',
                '#latitude': 'latitude',
                '#longtitude': 'longtitude',
                '#available_time': 'available_time',
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':foodId': { S: foodId },
                ':quantity': { N: Number(quantity).toString() },
                ':latitude': { S: latitude || "" },
                ':longtitude': { S: longtitude || "" },
                ':available_time': { S: available_time || "" },
                ':status': { S: status || "รอดำเนินการ" }
            }
        }));






        /*console.log("Update values:", {
            ':foodId': foodId,
            ':quantity': Number(quantity),
            ':latitude': latitude,
            ':longtitude': longtitude,
            ':available_time': available_time,
            ':status': status
        });*/


        const foodName = foodItemDetails.foodName?.S || '';
        const img_url = foodItemDetails.img_url?.S || '';
        const unit = foodItemDetails.unit?.S || '';
        const expired_at = foodItemDetails.expired_at?.S || '';

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
            status: status || "รอดำเนินการ"
        });

    } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            return res.status(404).json({ error: "Share post not found" });
        }

        console.error("Update share error:", err);
        res.status(500).json({ error: "Failed to update share post" });
    }

};

module.exports = updateShare;
