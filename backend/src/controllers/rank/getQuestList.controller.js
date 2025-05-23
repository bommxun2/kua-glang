const { QueryCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const getQuestList = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. ดึงเควสต์ทั้งหมด
    const questRes = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        IndexName: "SKIndex", // ถ้าไม่มี GSI ที่ค้นจาก SK ต้องใช้ Scan แทน
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
          ":sk": { S: "DETAILS" },
        },
      })
    );

    const quests = questRes.Items || [];

    // 2. ดึงสถานะของแต่ละเควสต์
    const fullQuests = await Promise.all(
      quests.map(async (quest) => {
        const qId = quest.PK.S.split("#")[1];

        // ตรวจสอบว่า user ทำเควสต์นี้หรือยัง
        const checkRes = await dynamoDb.send(
          new GetItemCommand({
            TableName: "kua-glang",
            Key: {
              PK: { S: `USER#${userId}` },
              SK: { S: `QUEST#${qId}` },
            },
          })
        );

        return {
          qId,
          title: quest.title.S,
          reward_point: quest.reward_pointt?.N || "0",
          status: checkRes.Item ? "สำเร็จ" : "กำลังดำเนินการ",
        };
      })
    );

    return res.status(200).json(fullQuests);
  } catch (error) {
    console.error("Error fetching quests:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getQuestList;
