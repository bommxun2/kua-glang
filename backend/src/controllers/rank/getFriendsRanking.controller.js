const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const getFriendsRanking = async (req, res) => {
  const { userId } = req.params;
  const { rankingType, number } = req.query;

  const limit = parseInt(number) || 10;

  const validTypes = {
    share_quantity: "ครั้ง",
    reduce_foodwaste: "KG",
    no_expired: "KG",
  };

  if (!validTypes[rankingType]) {
    return res.status(400).json({ message: "Invalid ranking type" });
  }

  try {
    // 1. ดึง userIds ของเพื่อนทั้งหมด
    const followRes = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": { S: `USER#${userId}` },
          ":sk": { S: "FOLLOWING#" },
        },
      })
    );

    const friendIds =
      followRes.Items?.map((item) => item.SK.S.split("#")[1]) || [];

    // ใส่ userId ตัวเองเข้าไปด้วยเพื่อดึงอันดับ
    const idsToFetch = [...friendIds, userId];

    // 2. ดึง STAT ของทุกคนใน idsToFetch
    const statItems = [];

    for (const uid of idsToFetch) {
      const statRes = await dynamoDb.send(
        new QueryCommand({
          TableName: "kua-glang",
          KeyConditionExpression: "PK = :pk AND SK = :sk",
          ExpressionAttributeValues: {
            ":pk": { S: `USER#${uid}` },
            ":sk": { S: "STAT" },
          },
        })
      );

      if (statRes.Items?.length) {
        const stat = statRes.Items[0];
        statItems.push({
          userId: uid,
          quantity: parseInt(stat[rankingType]?.N || "0", 10),
        });
      }
    }

    // 3. จัดอันดับตาม quantity
    const sorted = statItems
      .sort((a, b) => b.quantity - a.quantity)
      .map((item, index) => ({
        ...item,
        position: (index + 1).toString(),
      }));

    // 4. Slice Top N เพื่อน (ไม่รวมเรา)
    const topN = sorted.filter((i) => i.userId !== userId).slice(0, limit);

    // 5. หาอันดับของตัวเอง
    const self = sorted.find((i) => i.userId === userId);
    const includeSelf = self && !topN.some((f) => f.userId === userId);

    // 6. เติมข้อมูลโปรไฟล์
    const enrich = async (entry) => {
      const profileRes = await dynamoDb.send(
        new QueryCommand({
          TableName: "kua-glang",
          KeyConditionExpression: "PK = :pk AND SK = :sk",
          ExpressionAttributeValues: {
            ":pk": { S: `USER#${entry.userId}` },
            ":sk": { S: "PROFILE" },
          },
        })
      );

      const profile = profileRes.Items?.[0] || {};
      return {
        position: entry.position,
        username: profile.username?.S || "unknown",
        profile_img: profile.profile_url?.S || "",
        quantity: entry.quantity.toString(),
        unit: validTypes[rankingType],
      };
    };

    const result = await Promise.all(topN.map(enrich));

    if (includeSelf) {
      const enrichedSelf = await enrich(self);
      result.push(enrichedSelf);
    }

    // 7. ส่งกลับแบบแบ่งตาม rankingType
    return res.status(200).json({
      [rankingType === "share_quantity"
        ? "share"
        : rankingType === "reduce_foodwaste"
        ? "food_waste"
        : "eat_expried"]: result,
    });
  } catch (error) {
    console.error("Error in getFriendsRanking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getFriendsRanking;
