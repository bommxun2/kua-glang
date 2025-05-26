const {
  DynamoDBClient,
  ScanCommand,
  QueryCommand,
} = require("@aws-sdk/client-dynamodb");
const {
  SNSClient,
  CreateTopicCommand,
  PublishCommand,
} = require("@aws-sdk/client-sns");

const ddbClient = new DynamoDBClient({});
const snsClient = new SNSClient({});

const TABLE_NAME = "kua-glang";
const TOPIC_NAME = "kua-notification-topic";

exports.handler = async () => {
  try {
    // 1. สแกนทุก user
    const users = [];
    let ExclusiveStartKey;
    do {
      const scanParams = {
        TableName: TABLE_NAME,
        FilterExpression: "begins_with(PK, :userPrefix) AND SK = :profile",
        ExpressionAttributeValues: {
          ":userPrefix": { S: "USER#" },
          ":profile": { S: "PROFILE" },
        },
        ExclusiveStartKey,
      };
      const scanResult = await ddbClient.send(new ScanCommand(scanParams));
      users.push(...scanResult.Items);
      ExclusiveStartKey = scanResult.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    if (users.length === 0) {
      return { statusCode: 200, body: "No users found" };
    }

    // 2. สร้างหรือดึง SNS topic แค่ครั้งเดียว
    const topicData = await snsClient.send(
      new CreateTopicCommand({ Name: TOPIC_NAME })
    );
    const topicArn = topicData.TopicArn;

    const now = new Date();
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // 3. ไล่เช็คแต่ละ user
    for (const user of users) {
      const userId = user.PK.S.split("#")[1];
      const username = user.username.S;
      const email = user.email?.S;

      if (!email) continue; // ข้าม user ที่ไม่มี email

      const expiringFoodsByFolder = {};

      // ดึง folders ของ user
      const folderParams = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk and begins_with(SK, :folderPrefix)",
        ExpressionAttributeValues: {
          ":pk": { S: `USER#${userId}` },
          ":folderPrefix": { S: "FOLDER#" },
        },
      };
      const foldersData = await ddbClient.send(new QueryCommand(folderParams));

      for (const folder of foldersData.Items) {
        const folderId = folder.SK.S.split("#")[1];
        const folderName = folder.folderName.S;

        // ดึงอาหารใน folder
        const foodParams = {
          TableName: TABLE_NAME,
          KeyConditionExpression: "PK = :pk and begins_with(SK, :foodPrefix)",
          ExpressionAttributeValues: {
            ":pk": { S: `FOLDER#${folderId}` },
            ":foodPrefix": { S: "FOOD#" },
          },
        };
        const foodsData = await ddbClient.send(new QueryCommand(foodParams));

        for (const food of foodsData.Items) {
          const expiredAtStr = food.expired_at?.S;
          if (!expiredAtStr) continue;

          const expiredAt = new Date(expiredAtStr);
          if (
            expiredAt >= now &&
            (expiredAt <= oneDayLater || expiredAt <= threeDaysLater)
          ) {
            if (!expiringFoodsByFolder[folderId]) {
              expiringFoodsByFolder[folderId] = [];
            }
            expiringFoodsByFolder[folderId].push({
              foodName: food.foodName.S,
              expiredAt: expiredAtStr,
              folderName: folderName,
            });
          }
        }
      }

      if (Object.keys(expiringFoodsByFolder).length === 0) continue;

      const displayName = username.charAt(0).toUpperCase() + username.slice(1);
      let message = `${displayName} มีอาหารที่จะหมดอายุหลายรายการ\n`;

      for (const [folderId, foods] of Object.entries(expiringFoodsByFolder)) {
        const folderName = foods[0]?.folderName || "ไม่ทราบชื่อโฟลเดอร์";

        message += `\n📁 รายการ: ${folderName}\n`;
        for (const f of foods) {
          const dateObj = new Date(f.expiredAt);
          const formattedDate = dateObj.toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          message += `- ${f.foodName} (หมดอายุวันที่ ${formattedDate})\n`;
        }
      }

      await snsClient.send(
        new PublishCommand({
          TopicArn: topicArn,
          Message: message,
          Subject: `Kua Notification - อาหารของคุณใกล้หมดอายุแล้ว!`,
        })
      );
    }

    return { statusCode: 200, body: "Done processing users" };
  } catch (error) {
    console.error("Error:", error);
    return { statusCode: 500, body: "Internal server error" };
  }
};
