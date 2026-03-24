const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const clientConfig = {
  region: "us-east-1",
};

if (process.env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
}

const dynamoDbClient = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(dynamoDbClient);

module.exports = docClient;
