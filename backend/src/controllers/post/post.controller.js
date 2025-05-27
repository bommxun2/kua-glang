const { PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = require("../../utils/database");

const { nanoid } = require('nanoid');

const createPost = async (req, res) => {
  const { userId } = req.params;
  const { caption, img_url } = req.body;

  if (!caption && !img_url) {
    return res.status(400).json({ error: 'caption and img_url are required' });
  }

  const postId = nanoid(4); 
  const createdAt = new Date().toISOString();

  const postItem = {
    PK: { S: `USER#${userId}` },
    SK: { S: `POST#${postId}` },
    caption: { S: caption },
    img_url: { S: img_url },
    created_at: { S: createdAt }
  };

  try {
    await client.send(new PutItemCommand({
      TableName: 'kua-glang',
      Item: postItem,
    }));

    res.json({
      postId,
      caption,
      created_at: createdAt,
      img_url,
    });

  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

module.exports = createPost;