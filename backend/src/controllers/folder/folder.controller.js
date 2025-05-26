const dynamoDb = require("../../utils/database");
const {
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");

const TABLE_NAME = "kua-glang";

// Helper function to convert DynamoDB AttributeValue to plain JS object
function parseDynamoItem(item) {
  return {
    quantity: item.quantity ? Number(item.quantity.N) : undefined,
    img_url: item.img_url?.S,
    folderId: item.SK?.S?.replace("FOLDER#", ""),
    description: item.description?.S,
    created_at: item.created_at?.S,
    userId: item.PK?.S?.replace("USER#", ""),
    folderName: item.folderName?.S,
  };
}

exports.listFolders = async (req, res) => {
  const { userId } = req.params;
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": { S: `USER#${userId}` },
      ":sk": { S: "FOLDER#" },
    },
  };
  try {
    const command = new QueryCommand(params);
    const data = await dynamoDb.send(command);
    // แปลงข้อมูลก่อนส่งออก
    const folders = (data.Items || []).map(parseDynamoItem);
    res.json(folders);
  } catch (err) {
    res.status(500).json({
      error: "Failed to list folders",
      details: err.message,
      params,
    });
  }
};

exports.updateFolder = async (req, res) => {
  const { userId, folderId } = req.params;
  // รับ quntity (ไม่ใช่ quantity) ตาม API
  const { folderName, description } = req.body;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `USER#${userId}` },
      SK: { S: `FOLDER#${folderId}` },
    },
    UpdateExpression: "set folderName = :n, description = :d",
    ExpressionAttributeValues: {
      ":n": { S: folderName },
      ":d": { S: description },
    },
    ReturnValues: "ALL_NEW",
  };
  try {
    const data = await dynamoDb.send(new UpdateItemCommand(params));
    // ส่ง response กลับแบบอ่านง่าย
    res.json({
      folderName: folderName,
      description: description,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to update folder",
      details: err.message,
      params,
    });
  }
};

exports.deleteFolder = async (req, res) => {
  const { userId, folderId } = req.params;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `USER#${userId}` },
      SK: { S: `FOLDER#${folderId}` },
    },
  };
  try {
    await dynamoDb.send(new DeleteItemCommand(params));
    res.json({ message: "delete folder success" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete folder",
      details: err.message,
      params,
    });
  }
};
