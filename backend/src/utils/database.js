const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const dynamoDbClient = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://kua-dynamodb:8000",
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoDbClient);

module.exports = docClient;
