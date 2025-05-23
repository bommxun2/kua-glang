const dynamoDb = require('../utils/database');

const TABLE_NAME = 'kua-main';

exports.listFoods = async (req, res) => {
  const { folderid } = req.params;
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `FOLDER#${folderid}`,
      ':sk': 'FOOD#',
    },
  };
  try {
    const data = await dynamoDb.query(params).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to list foods',
      details: err.message,
      params
    });
  }
};

exports.addFood = async (req, res) => {
  const { folderid } = req.params;
  const foodId = Date.now().toString();
  const item = {
    PK: `FOLDER#${folderid}`,
    SK: `FOOD#${foodId}`,
    foodId,
    folderId: folderid,
    ...req.body,
    created_at: new Date().toISOString(),
  };
  const params = { TableName: TABLE_NAME, Item: item };
  try {
    await dynamoDb.put(params).promise();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to add food',
      details: err.message,
      params
    });
  }
};

exports.updateFood = async (req, res) => {
  const { folderid, foodid } = req.params;
  const { foodName, unit, expired_at, quantity, category, img_url } = req.body;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: `FOLDER#${folderid}`,
      SK: `FOOD#${foodid}`,
    },
    UpdateExpression: 'set foodName = :n, unit = :u, expired_at = :e, quantity = :q, category = :c, img_url = :i',
    ExpressionAttributeValues: {
      ':n': foodName,
      ':u': unit,
      ':e': expired_at,
      ':q': quantity,
      ':c': category,
      ':i': img_url,
    },
    ReturnValues: 'ALL_NEW',
  };
  try {
    const data = await dynamoDb.update(params).promise();
    res.json(data.Attributes);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to update food',
      details: err.message,
      params
    });
  }
};
