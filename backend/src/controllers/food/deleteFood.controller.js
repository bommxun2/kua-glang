// filepath: backend/src/controllers/food/deleteFood.controller.js

const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDb = require("../../utils/database");

module.exports = async (req, res) => {
  const { userid, folderid } = req.params;
  if (!userid || !folderid) {
    return res.status(400).json({ error: "userid and folderid are required" });
  }
  const params = {
    TableName: "kua-glang",
    Key: {
      userId: userid,
      folderId: folderid,
    },
  };
  try {
    await dynamoDb.send(new DeleteCommand(params));
    return res.status(200).json({ message: "delete folder success" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
