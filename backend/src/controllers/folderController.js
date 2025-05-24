const dynamoDb = require('../utils/database');

const TABLE_NAME = 'kua-main';

exports.listFolders = async (req, res) => {
  const { userid } = req.params;
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userid}`,
      ':sk': 'FOLDER#',
    },
  };
  try {
    const data = await dynamoDb.query(params).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to list folders',
      details: err.message,
      params
    });
  }
};

exports.addFolder = async (req, res) => {
  const { userid } = req.params;
  const folderId = Date.now().toString();
  const item = {
    PK: `USER#${userid}`,
    SK: `FOLDER#${folderId}`,
    folderId,
    userId: userid, // ใช้ userId (I ตัวใหญ่) ให้ตรงกับ API spec
    ...req.body,
    created_at: new Date().toISOString(),
  };
  // ensure field quntity (ไม่ใช่ quantity) ตาม API
  if (item.quantity && !item.quntity) {
    item.quntity = item.quantity;
    delete item.quantity;
  }
  const params = { TableName: TABLE_NAME, Item: item };
  try {
    await dynamoDb.put(params).promise();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to add folder',
      details: err.message,
      params
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
    UpdateExpression: 'set folderName = :n, description = :d, quntity = :q, img_url = :i',
    ExpressionAttributeValues: {
      ':n': folderName,
      ':d': description,
      ':q': quntity,
      ':i': img_url,
    },
    ReturnValues: 'ALL_NEW',
  };
  try {
    const data = await dynamoDb.update(params).promise();
    res.json(data.Attributes);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to update folder',
      details: err.message,
      params
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
    res.json({ message: 'delete folder success' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to delete folder',
      details: err.message,
      params
    });
  }
};
