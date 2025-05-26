const { QueryCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const ddb = require("../../utils/database");
const TABLE_NAME = "kua-glang";

const getSharesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. ดึงรายการแชร์ทั้งหมดของ user นี้
    const shareData = await ddb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `USER#${userId}`,
          ":sk": "SHARE#",
        },
      })
    );

    const shares = shareData.Items || [];

    const responses = await Promise.all(
      shares.map(async (share) => {
        const shareId = share.SK.replace("SHARE#", "");
        const { created_at, available_time, quantity, foodId } = share;

        // 2. ดึงข้อมูลอาหารจาก SKIndex
        const foodRes = await ddb.send(
          new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: "SKIndex",
            KeyConditionExpression: "SK = :sk",
            ExpressionAttributeValues: {
              ":sk": `FOOD#${foodId}`,
            },
            Limit: 1,
          })
        );

        const food = foodRes.Items?.[0];

        const foodName = food?.foodName || "ไม่ทราบชื่ออาหาร";
        const img_url = food?.img_url || null;
        const expired_at = food?.expired_at || null;

        // 3. ไปดูว่า share นี้เคยถูกอนุมัติให้ใครบ้าง
        const receiverRes = await ddb.send(
          new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
              ":pk": `SHARE#${shareId}`,
              ":sk": "RECEIVE#",
            },
          })
        );

        const receivers = receiverRes.Items || [];

        const acceptedUsers = await Promise.all(
          receivers.map(async (recv) => {
            const recvUserId = recv.SK.replace("RECEIVE#", "");
            const acceptedAt = recv.accepted_at;

            const profileRes = await ddb.send(
              new GetCommand({
                TableName: TABLE_NAME,
                Key: {
                  PK: `USER#${recvUserId}`,
                  SK: "PROFILE",
                },
              })
            );

            const username = profileRes.Item?.username || "ไม่ทราบชื่อ";
            const profile_url = profileRes.Item?.profile_url || "";
            return {
              userId: recvUserId,
              username,
              accepted_at: acceptedAt,
              profile_url,
            };
          })
        );

        return {
          shareId,
          foodId,
          foodName,
          img_url,
          expired_at,
          quantity,
          created_at,
          available_time,
          accepted_by: acceptedUsers,
        };
      })
    );

    res.json(responses);
  } catch (err) {
    console.error("Error in getSharesByUser:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = getSharesByUser;
