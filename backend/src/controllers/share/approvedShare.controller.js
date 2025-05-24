const { QueryCommand, TransactWriteCommand } = require('@aws-sdk/lib-dynamodb');
const docClient = require('../../utils/database');

const receiveShare = async (req, res) => {
  const { shareId } = req.params;
  const { username } = req.body;
  const timestamp = new Date().toISOString();

  try {
    const queryResult = await docClient.send(
      new QueryCommand({
        TableName: 'kua-glang',
        IndexName: 'SKIndex',
        KeyConditionExpression: 'SK = :sk',
        ExpressionAttributeValues: {
          ':sk': `SHARE#${shareId}`,
        },
      })
    );

    if (queryResult.Items.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้ที่ต้องอัปเดต' });
    }

    const userItem = queryResult.Items[0]; // เอารายการแรก (ในกรณีมีหลาย user ต้องจัดการเพิ่ม)
    const userId = userItem.PK.replace('USER#', '');

    const transactParams = {
      TransactItems: [
        {
          Put: {
            TableName: 'kua-glang',
            Item: {
              PK: `SHARE#${shareId}`,
              SK: `INTEREST#${userId}`,
              userId,
              username,
              interested_at: timestamp,
            },
          },
        },
        {
          Put: {
            TableName: 'kua-glang',
            Item: {
              PK: `SHARE#${shareId}`,
              SK: `RECEIVE#${userId}`,
              accepted_at: timestamp,
            },
          },
        },
        {
          Update: {
            TableName: 'kua-glang',
            Key: {
              PK: `USER#${userId}`,
              SK: `SHARE#${shareId}`,
            },
            UpdateExpression: 'SET #st = :status',
            ExpressionAttributeNames: {
              '#st': 'status',
            },
            ExpressionAttributeValues: {
              ':status': 'ดำเนินการสำเร็จ',
            },
          },
        },
      ],
    };

    await docClient.send(new TransactWriteCommand(transactParams));

    res.status(200).json({
      userId,
      username,
      interested_at: timestamp,
    });
  } catch (error) {
    console.error('Error in receiveShare:', error);
    res.status(500).json({ error: 'ไม่สามารถดำเนินการได้' });
  }
};

module.exports = receiveShare;
