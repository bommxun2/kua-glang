const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const dynamoDb = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://kua-dynamodb:8000", // ชี้ไปที่ชื่อ container
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

module.exports = dynamoDb;
