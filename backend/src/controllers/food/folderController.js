const dynamoDb = require('../../utils/database');
const { PutItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");

const TABLE_NAME = 'kua-glang';

exports.listFolders = async (req, res) => {
  const { userId } = req.params;
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ':pk': { S: `USER#${userId}` },
      ':sk': { S: 'FOLDER#' },
    },
  };
  try {
    const command = new QueryCommand(params);
    const data = await dynamoDb.send(command);
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({
      error: "Failed to list folders",
      details: err.message,
      params,
    });
  }
};

exports.addFolder = async (req, res) => {
  // ใช้ userId ให้ตรงกับ route (userId ไม่ใช่ userid)
  const { userId } = req.params;
  const folderId = Date.now().toString();

  // Debug log
  console.log('addFolder params:', req.params);
  console.log('addFolder body:', req.body);

  let quntity = req.body.quntity || req.body.quantity || "00";

  // แปลงค่าทุก field เป็นรูปแบบ DynamoDB
  const item = {
    PK: { S: `USER#${userId}` },
    SK: { S: `FOLDER#${folderId}` },
    folderId: { S: folderId },
    userId: { S: userId },
    folderName: { S: req.body.folderName || "" },
    description: { S: req.body.description || "" },
    quntity: { S: quntity },
    img_url: { S: req.body.img_url || "" },
    created_at: { S: new Date().toISOString() }
  };

  const params = { TableName: TABLE_NAME, Item: item };
  try {
    await dynamoDb.send(new PutItemCommand(params));
    res.status(201).json(item);
  } catch (err) {
    console.error('Failed to add folder', err);
    res.status(500).json({ 
      error: 'Failed to add folder',
      details: err.message,
      params,
    });
  }
};

exports.updateFolder = async (req, res) => {
  const { userid, folderid } = req.params;
  // รับ quntity (ไม่ใช่ quantity) ตาม API
  const { folderName, description, quntity, img_url } = req.body;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userid}`,
      SK: `FOLDER#${folderid}`,
    },
    UpdateExpression:
      "set folderName = :n, description = :d, quntity = :q, img_url = :i",
    ExpressionAttributeValues: {
      ":n": folderName,
      ":d": description,
      ":q": quntity,
      ":i": img_url,
    },
    ReturnValues: "ALL_NEW",
  };
  try {
    const data = await dynamoDb.update(params).promise();
    res.json(data.Attributes);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update folder",
      details: err.message,
      params,
    });
  }
};

exports.deleteFolder = async (req, res) => {
  const { userid, folderid } = req.params;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userid}`,
      SK: `FOLDER#${folderid}`,
    },
  };
  try {
    await dynamoDb.delete(params).promise();
    res.json({ message: "delete folder success" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete folder",
      details: err.message,
      params,
    });
  }
};
