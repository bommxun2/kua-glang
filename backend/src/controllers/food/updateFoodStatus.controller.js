const {
  QueryCommand,
  UpdateItemCommand,
  GetItemCommand,
} = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");

const updateFoodStatus = async (req, res) => {
  const { foodId } = req.params;

  try {
    const foodRes = await client.send(
      new QueryCommand({
        TableName: "kua-glang",
        IndexName: "SKIndex",
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
          ":sk": { S: `FOOD#${foodId}` },
        },
      })
    );

    if (!foodRes.Items || foodRes.Items.length === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    const item = foodRes.Items[0];
    const PK = item.PK.S;
    const SK = item.SK.S;
    const quantity = parseInt(item.quantity?.N || "1");
    const useNow = new Date().toISOString();

    const expiredAt = item.expired_at?.S;
    const usedBeforeExpire =
      expiredAt && new Date(useNow) < new Date(expiredAt);

    // อัปเดตสถานะอาหาร
    await client.send(
      new UpdateItemCommand({
        TableName: "kua-glang",
        Key: {
          PK: { S: PK },
          SK: { S: SK },
        },
        UpdateExpression: "SET #status = :used, #use_at = :now",
        ExpressionAttributeNames: {
          "#status": "status",
          "#use_at": "use_at",
        },
        ExpressionAttributeValues: {
          ":used": { S: "ใช้ไปแล้ว" },
          ":now": { S: useNow },
        },
      })
    );

    // หาว่า userId คือใคร
    const folderId = PK.split("#")[1];

    const folderRes = await client.send(
      new QueryCommand({
        TableName: "kua-glang",
        IndexName: "SKIndex",
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
          ":sk": { S: `FOLDER#${folderId}` },
        },
      })
    );

    if (!folderRes.Items || folderRes.Items.length === 0) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const userId = folderRes.Items[0].PK.S.split("#")[1];

    const statKey = {
      PK: { S: `USER#${userId}` },
      SK: { S: "STAT" },
    };

    // ✅ แก้ตรงนี้ให้ใช้ ExpressionAttributeNames ครบทุกฟิลด์ที่มี # ใน UpdateExpression
    const updateExpressions = [];
    const expressionAttributeValues = {
      ":q": { N: quantity.toString() },
      ":zero": { N: "0" },
      ":now": { S: useNow },
    };
    const expressionAttributeNames = {
      "#reduce_foodwaste": "reduce_foodwaste",
      "#updated_at": "updated_at",
    };

    if (usedBeforeExpire) {
      updateExpressions.push(
        "#no_expired = if_not_exists(#no_expired, :zero) + :one"
      );
      expressionAttributeValues[":one"] = { N: "1" };
      expressionAttributeNames["#no_expired"] = "no_expired";
    }

    updateExpressions.push(
      "#reduce_foodwaste = if_not_exists(#reduce_foodwaste, :zero) + :q"
    );
    updateExpressions.push("#updated_at = :now");

    const UpdateExpression = `SET ${updateExpressions.join(", ")}`;

    // อัปเดตสถิติผู้ใช้
    await client.send(
      new UpdateItemCommand({
        TableName: "kua-glang",
        Key: statKey,
        UpdateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    return res.status(200).json({ message: "update food success" });
  } catch (err) {
    console.error("Update food status failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateFoodStatus;
