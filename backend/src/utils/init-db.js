const {
  CreateTableCommand,
  PutItemCommand,
} = require("@aws-sdk/client-dynamodb");
const dynamoDb = require("./database");

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

const items = [
  // User Profile
  {
    PK: { S: "USER#user123" },
    SK: { S: "PROFILE" },
    username: { S: "neon" },
    email: { S: "neon@example.com" },
    phone_num: { S: "0812345678" },
    line_id: { S: "neonline" },
    password: { S: "hashed_password" },
    profile_url: { S: "https://img.com/neon.jpg" },
    bio: { S: "Love sharing food" },
    score: { N: "1500" },
  },

  // User Stat
  {
    PK: { S: "USER#user123" },
    SK: { S: "STAT" },
    share_quantity: { N: "12" },
    reduce_foodwaste: { N: "5" },
    no_expired: { N: "3" },
    updated_at: { S: "2025-05-20T10:00:00Z" },
  },

  // Folder
  {
    PK: { S: "USER#user123" },
    SK: { S: "FOLDER#folder001" },
    folderName: { S: "Fresh Vegetables" },
    description: { S: "All kinds of fresh veggies" },
    created_at: { S: "2025-05-01T09:00:00Z" },
    quantity: { N: "5" },
    img_url: { S: "https://img.com/folder001.jpg" },
  },

  // Food inside Folder
  {
    PK: { S: "FOLDER#folder001" },
    SK: { S: "FOOD#food001" },
    foodName: { S: "Tomato" },
    created_at: { S: "2025-04-25T12:00:00Z" },
    expired_at: { S: "2025-05-30T00:00:00Z" },
    unit: { S: "kg" },
    quantity: { N: "3" },
    img_url: { S: "https://img.com/tomato.jpg" },
    category: { S: "Vegetable" },
  },

  // SharePost
  {
    PK: { S: "USER#user123" },
    SK: { S: "SHARE#share001" },
    avaliable_time: { S: "14:00 - 16:00" },
    status: { S: "success" },
    foodId: { S: "food001" },
    quantity: { N: "2" },
    latitude: { S: "13.7563" },
    longtitude: { S: "100.5018" },
    created_at: { S: "2025-05-21T10:00:00Z" },
  },

  // Receiver
  {
    PK: { S: "SHARE#share001" },
    SK: { S: "RECEIVE#user456" },
    accepted_at: { S: "2025-05-21T11:00:00Z" },
  },

  // Interested
  {
    PK: { S: "SHARE#share001" },
    SK: { S: "INTEREST#user789" },
    interested_at: { S: "2025-05-20T15:30:00Z" },
  },

  // Post
  {
    PK: { S: "USER#user123" },
    SK: { S: "POST#post001" },
    caption: { S: "My new recipe" },
    img_url: { S: "https://img.com/post001.jpg" },
    created_at: { S: "2025-05-20T12:00:00Z" },
  },

  // Comment
  {
    PK: { S: "POST#post001" },
    SK: { S: "COMMENT#comment001" },
    userId: { S: "user456" },
    content: { S: "Looks delicious!" },
    comment_at: { S: "2025-05-20T13:00:00Z" },
  },

  // Like on Post
  {
    PK: { S: "POST#post001" },
    SK: { S: "LIKE#user789" },
    liked_At: { S: "2025-05-20T14:00:00Z" },
  },

  // Like on Comment
  {
    PK: { S: "COMMENT#comment001" },
    SK: { S: "LIKE#user123" },
    liked_At: { S: "2025-05-20T14:30:00Z" },
  },

  // Following
  {
    PK: { S: "USER#user123" },
    SK: { S: "FOLLOWING#user456" },
    followed_At: { S: "2025-05-19T09:00:00Z" },
  },

  // Follower
  {
    PK: { S: "USER#user456" },
    SK: { S: "FOLLOWER#user123" },
    followed_At: { S: "2025-05-19T09:00:00Z" },
  },

  // Quest Details
  {
    PK: { S: "QUEST#quest001" },
    SK: { S: "DETAILS" },
    title: { S: "Reduce food waste" },
    description: { S: "Share food to reduce waste" },
    create_at: { S: "2025-05-01T00:00:00Z" },
    reward_point: { N: "100" },
  },

  // Quest Success by user
  {
    PK: { S: "USER#user123" },
    SK: { S: "QUEST#quest001" },
    success_at: { S: "2025-05-21T08:00:00Z" },
  },

  // Ranking example (type1)
  {
    PK: { S: "USER#user123" },
    SK: { S: "RANKING#share_quantity" },
    updated_at: { S: "2025-05-21T00:00:00Z" },
    position: { N: "10" },
    quantity: { N: "12" },
    unit: { S: "shares" },
  },

  // Ranking example (type2)
  {
    PK: { S: "USER#user123" },
    SK: { S: "RANKING#reduce_foodwaste" },
    updated_at: { S: "2025-05-21T00:00:00Z" },
    position: { N: "8" },
    quantity: { N: "5" },
    unit: { S: "kg" },
  },

  // Ranking example (type3)
  {
    PK: { S: "USER#user123" },
    SK: { S: "RANKING#no_expired" },
    updated_at: { S: "2025-05-21T00:00:00Z" },
    position: { N: "15" },
    quantity: { N: "3" },
    unit: { S: "items" },
  },
];

const seed = async () => {
  for (const item of items) {
    try {
      await dynamoDb.send(
        new PutItemCommand({
          TableName: "kua-glang",
          Item: item,
        })
      );
      console.log(`Inserted item with PK: ${item.PK.S}, SK: ${item.SK.S}`);
    } catch (err) {
      console.error("Error inserting item", err);
    }
  }
};

seed();
