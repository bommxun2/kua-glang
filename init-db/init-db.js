const { readFileSync } = require("fs");
const {
  CreateTableCommand,
  BatchWriteItemCommand,
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const dynamoDb = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://dynamodb:8000",
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

const params = {
  TableName: "kua-glang",
  AttributeDefinitions: [
    { AttributeName: "PK", AttributeType: "S" },
    { AttributeName: "SK", AttributeType: "S" },
  ],
  KeySchema: [
    { AttributeName: "PK", KeyType: "HASH" },
    { AttributeName: "SK", KeyType: "RANGE" },
  ],
  BillingMode: "PAY_PER_REQUEST",
  GlobalSecondaryIndexes: [
    {
      IndexName: "SKIndex",
      KeySchema: [{ AttributeName: "SK", KeyType: "HASH" }],
      Projection: {
        ProjectionType: "ALL",
      },
    },
  ],
};

const createTable = async () => {
  try {
    const data = await dynamoDb.send(new CreateTableCommand(params));
    console.log("Table created", data);
  } catch (err) {
    console.error(err);
  }
};

createTable();

const items = JSON.parse(readFileSync("./mock_data.json", "utf8"));

const insertDataInBatches = async (items, batchSize = 25) => {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const command = new BatchWriteItemCommand({
      RequestItems: {
        ["kua-glang"]: batch,
      },
    });

    try {
      const res = await dynamoDb.send(command);
      console.log("✅ Batch ${i / batchSize + 1} inserted");
      if (Object.keys(res.UnprocessedItems).length > 0) {
        console.warn(
          ":warning: มีบางรายการไม่ถูกประมวลผล:",
          res.UnprocessedItems
        );
      }
    } catch (err) {
      console.error("❌ Error inserting batch ${i / batchSize + 1}`", err);
    }
  }
};

insertDataInBatches(items);
