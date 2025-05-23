const { UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("../../utils/database");

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const allowedFields = [
    "username",
    "email",
    "phone_num",
    "line_id",
    "profile_url",
    "bio",
  ];

  const fieldsToUpdate = Object.entries(req.body).filter(
    ([key, value]) =>
      allowedFields.includes(key) && value != null && value !== ""
  );

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  const updateExprParts = [];
  const exprAttrValues = {};

  for (const [key, value] of fieldsToUpdate) {
    updateExprParts.push(`${key} = :${key}`);
    exprAttrValues[`:${key}`] = { S: value };
  }

  const updateExpression = "SET " + updateExprParts.join(", ");

  try {
    const command = new UpdateItemCommand({
      TableName: "kua-glang",
      Key: {
        PK: { S: `USER#${userId}` },
        SK: { S: "PROFILE" },
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: "UPDATED_NEW",
    });

    await dynamoDb.send(command);

    return res.status(200).json({ message: "Update profile success" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updateUserProfile;
