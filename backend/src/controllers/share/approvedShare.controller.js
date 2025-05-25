const { QueryCommand, TransactWriteCommand } = require("@aws-sdk/lib-dynamodb");
const docClient = require("../../utils/database");
const { nanoid } = require("nanoid");

const receiveShare = async (req, res) => {
  const { shareId, userId } = req.params;
  const timestamp = new Date().toISOString();

  try {
    const queryResult = await docClient.send(
      new QueryCommand({
        TableName: "kua-glang",
        IndexName: "SKIndex",
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
          ":sk": `SHARE#${shareId}`,
        },
      })
    );

    if (queryResult.Items.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้ที่ต้องอัปเดต" });
    }

    const owerUserItem = queryResult.Items[0]; // เอารายการแรก (ในกรณีมีหลาย user ต้องจัดการเพิ่ม)
    const owerUserId = owerUserItem.PK.replace("USER#", "");
    const { foodId, quantity } = queryResult.Items[0];

    const foodQueryResult = await docClient.send(
      new QueryCommand({
        TableName: "kua-glang",
        IndexName: "SKIndex", // ใช้ GSI ที่ตั้งไว้
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
          ":sk": `FOOD#${foodId}`,
        },
      })
    );

    if (foodQueryResult.Items.length === 0) {
      return res
        .status(404)
        .json({ error: "ไม่พบข้อมูลอาหารที่ต้องการคัดลอก" });
    }

    const foodItem = foodQueryResult.Items[0]; // อาจมีหลายรายการ แต่เลือกตัวแรกไว้ก่อน

    let ownerFoodUpdateOrDelete;
    if (quantity >= foodItem.quantity) {
      ownerFoodUpdateOrDelete = {
        Delete: {
          TableName: "kua-glang",
          Key: {
            PK: foodItem.PK,
            SK: foodItem.SK,
          },
        },
      };
    } else {
      ownerFoodUpdateOrDelete = {
        Update: {
          TableName: "kua-glang",
          Key: {
            PK: foodItem.PK,
            SK: foodItem.SK,
          },
          UpdateExpression: "SET quantity = quantity - :q",
          ConditionExpression: "quantity >= :q",
          ExpressionAttributeValues: {
            ":q": quantity,
          },
        },
      };
    }

    const foldersData = await docClient.send(
      new QueryCommand({
        TableName: "kua-glang",
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `USER#${userId}`,
          ":sk": "FOLDER#",
        },
        ScanIndexForward: false, // เรียงจากใหม่สุดไปเก่าสุด
        Limit: 1,
      })
    );
    const latestFolderId = foldersData.Items[0].SK.replace("FOLDER#", "");

    const newFoodId = nanoid(4); // หรือจะใช้ uuid ใหม่ก็ได้

    const newFoodItem = {
      ...foodItem,
      PK: `FOLDER#${latestFolderId}`,
      SK: `FOOD#${newFoodId}`,
      status: "ยังไม่ถูกใช้",
      use_at: null,
      created_at: timestamp,
    };

    const transactParams = {
      TransactItems: [
        {
          Put: {
            TableName: "kua-glang",
            Item: {
              PK: `SHARE#${shareId}`,
              SK: `RECEIVE#${userId}`,
              accepted_at: timestamp,
            },
          },
        },
        {
          Update: {
            TableName: "kua-glang",
            Key: {
              PK: `USER#${owerUserId}`,
              SK: `SHARE#${shareId}`,
            },
            UpdateExpression: "SET #st = :status",
            ExpressionAttributeNames: {
              "#st": "status",
            },
            ExpressionAttributeValues: {
              ":status": "สำเร็จ",
            },
          },
        },
        {
          Put: {
            TableName: "kua-glang",
            Item: newFoodItem,
          },
        },
        ownerFoodUpdateOrDelete,
      ],
    };

    await docClient.send(new TransactWriteCommand(transactParams));

    res.status(200).json({
      userId,
      interested_at: timestamp,
    });
  } catch (error) {
    console.error("Error in receiveShare:", error);
    res.status(500).json({ error: "ไม่สามารถดำเนินการได้" });
  }
};

module.exports = receiveShare;
