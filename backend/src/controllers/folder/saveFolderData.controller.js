const { nanoid } = require("nanoid");
const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const saveFolderData = async (req, res) => {
  const { userId } = req.params;
  const {
    folderName,
    description,
    quntity,
    food = [],
    img_url,
    created_at,
  } = req.body;

  const folderId = nanoid(4);
  const PK = `USER#${userId}`;
  const SK = `FOLDER#${folderId}`;

  try {
    await dynamoDb.send(
      new PutItemCommand({
        TableName: "kua-glang",
        Item: {
          PK: { S: PK },
          SK: { S: SK },
          Type: { S: "Folder" },
          folderName: { S: folderName },
          description: { S: description },
          quantity: { S: quntity },
          img_url: { S: img_url },
          created_at: { S: created_at },
        },
      })
    );

    if (Array.isArray(food) && food.length > 0) {
      for (const item of food) {
        const foodId = nanoid(4);
        const {
          foodName,
          expired_at,
          unit,
          quntity,
          img_url,
          category,
          status,
        } = item;

        await dynamoDb.send(
          new PutItemCommand({
            TableName: "kua-glang",
            Item: {
              PK: { S: SK },
              SK: { S: `FOOD#${foodId}` },
              Type: { S: "Food" },
              foodName: { S: foodName },
              created_at: { S: created_at },
              expired_at: { S: expired_at },
              unit: { S: unit },
              quantity: { S: quntity },
              img_url: { S: img_url },
              category: { S: category },
              use_at: { NULL: true },
              status: { S: status },
            },
          })
        );
      }
    }

    return res.status(200).json({
      message: "Folder and food saved successfully",
      folderId,
    });
  } catch (err) {
    console.error("Error saving folder/food:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = saveFolderData;
