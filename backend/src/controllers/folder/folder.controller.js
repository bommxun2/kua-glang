const dynamoDb = require("../../utils/database");
const { PutItemCommand, QueryCommand, UpdateItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

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

exports.addFolder = async (req, res) => {
  const { userId } = req.params;
  const folderId = Date.now().toString();

  // Debug log
  console.log("addFolder params:", req.params);
  console.log("addFolder body:", req.body);

  // รับ quantity หรือ quntity (รองรับทั้งสอง)
  let quantity = req.body.quantity || req.body.quntity || "00";

  // ใช้ created_at จาก body ถ้ามี ไม่งั้นใช้เวลาปัจจุบัน
  const created_at = req.body.created_at || new Date().toISOString();

  // แปลงค่าทุก field เป็นรูปแบบ DynamoDB
  const item = {
    PK: { S: `USER#${userId}` },
    SK: { S: `FOLDER#${folderId}` },
    folderId: { S: folderId },
    userId: { S: userId },
    folderName: { S: req.body.folderName || "" },
    description: { S: req.body.description || "" },
    quantity: { S: quantity },
    img_url: { S: req.body.img_url || "" },
    created_at: { S: created_at },
  };

  const params = { TableName: TABLE_NAME, Item: item };
  try {
    await dynamoDb.send(new PutItemCommand(params));
    // ส่ง response กลับแบบอ่านง่าย
    res.status(201).json({
      folderId: folderId,
      folderName: req.body.folderName || "",
      description: req.body.description || "",
      created_at: created_at,
      quantity: quantity,
      img_url: req.body.img_url || ""
    });
  } catch (err) {
    console.error("Failed to add folder", err);
    res.status(500).json({
      error: "Failed to add folder",
      details: err.message,
      params,
    });
  }
};

exports.updateFolder = async (req, res) => {
  const { userId, folderId } = req.params;
  // รับ quntity (ไม่ใช่ quantity) ตาม API
  const { folderName, description, quntity, img_url } = req.body;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `USER#${userId}` },
      SK: { S: `FOLDER#${folderId}` },
    },
    UpdateExpression:
      "set folderName = :n, description = :d, quntity = :q, img_url = :i",
    ExpressionAttributeValues: {
      ":n": { S: folderName },
      ":d": { S: description },
      ":q": { S: quntity },
      ":i": { S: img_url },
    },
    ReturnValues: "ALL_NEW",
  };
  try {
    const data = await dynamoDb.send(new UpdateItemCommand(params));
    // ส่ง response กลับแบบอ่านง่าย
    res.json({
      folderName: folderName,
      description: description,
      quntity: quntity,
      img_url: img_url
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