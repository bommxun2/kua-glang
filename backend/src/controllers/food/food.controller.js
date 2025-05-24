// filepath: backend/src/controllers/food/food.controller.js

const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { nanoid } = require("nanoid");
const dynamoDb = require("../../utils/database");

exports.listFoods = async (req, res) => {
  const { folderId } = req.params;
  const today = new Date().toISOString();

  try {
    const foodsRes = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": { S: `FOLDER#${folderId}` },
          ":sk": { S: "FOOD#" },
        },
      })
    );

    const foods = (foodsRes.Items || [])
      .map((food) => ({
        foodId: food.foodId?.S || null,
        foodName: food.foodName?.S || null,
        unit: food.unit?.S || null,
        expired_at: food.expired_at?.S || null,
        quntity: food.quntity?.S || food.quantity?.N || null, // use 'quntity' if present, fallback to 'quantity'
        category: food.category?.S || null,
        img_url: food.img_url?.S || null,
        status: food.status?.S || null,
      }))
      .filter(
        (food) =>
          food.status === "ยังไม่ใช้" &&
          food.expired_at &&
          new Date(food.expired_at) > new Date(today)
      );

    return res.status(200).json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addFood = async (req, res) => {
  const { folderId } = req.params;
  const {
    foodName,
    unit,
    expired_at,
    quntity, // Note: use 'quntity' to match request/response
    category,
    img_url
  } = req.body;

  if (!foodName || !unit || !expired_at || !quntity || !category || !img_url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const foodId = nanoid();
  const item = {
    PK: `FOLDER#${folderId}`,
    SK: `FOOD#${foodId}`,
    foodId,
    folderId,
    foodName,
    unit,
    expired_at,
    quntity: String(quntity),
    category,
    img_url,
    status: "ยังไม่ใช้"
  };

  try {
    await dynamoDb.send(
      new PutCommand({
        TableName: "kua-glang",
        Item: item
      })
    );
    // Return only the required fields in the response
    return res.status(201).json({
      foodId,
      folderId,
      foodName,
      unit,
      expired_at,
      quntity: String(quntity),
      category,
      img_url,
      status: "ยังไม่ใช้"
    });
  } catch (error) {
    console.error("Error adding food:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateFood = async (req, res) => {
  const { folderId, foodId } = req.params;
  const {
    foodName,
    unit,
    expired_at,
    quntity,
    category,
    img_url
  } = req.body;

  if (!foodName || !unit || !expired_at || !quntity || !category || !img_url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const item = {
    PK: `FOLDER#${folderId}`,
    SK: `FOOD#${foodId}`,
    foodId,
    folderId,
    foodName,
    unit,
    expired_at,
    quntity: String(quntity),
    category,
    img_url,
    status: "ยังไม่ใช้"
  };

  try {
    await dynamoDb.send(
      new PutCommand({
        TableName: "kua-glang",
        Item: item
      })
    );
    return res.status(200).json(item);
  } catch (error) {
    console.error("Error updating food:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteFood = async (req, res) => {
  const { foodId } = req.params;
  if (!foodId) {
    return res.status(400).json({ error: "foodId is required" });
  }

  const { folderId } = req.params;

  // Find PK by foodId
  try {
    // Scan for the item to get PK (since Query requires full key schema)
    const result = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        KeyConditionExpression: "PK = :pk AND SK = :sk",
        ExpressionAttributeValues: {
          ":pk": { S: `FOLDER#${folderId}` },
          ":sk": { S: `FOOD#${foodId}` },
        },
      })
    );
    const food = (result.Items || [])[0];
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }
    const PK = food.PK.S;
    // Delete the item
    await dynamoDb.send(
      new DeleteCommand({
        TableName: "kua-glang",
        Key: { PK, SK: `FOOD#${foodId}` }
      })
    );
    return res.status(200).json({ message: "delete food success" });
  } catch (error) {
    console.error("Error deleting food:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
