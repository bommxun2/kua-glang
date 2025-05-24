const { PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = require("../../utils/database");

const { nanoid } = require('nanoid');

const createPost = async (req, res) => {
  const { userId } = req.params;
  const { caption, img_url } = req.body;

  if (!caption || !img_url) {
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

const receive = async (req, res) => {
  const { userId } = req.params;
  res.status(200).json({ message: `รับโพสต์ของ userId ${userId}` });
};



const updatePost = async (req, res) => {
  const { userId, postId } = req.params;
  const { caption, img_url } = req.body;

  if (!caption || !img_url) {
    return res.status(400).json({ error: 'caption and img_url are required' });
  }

  // (ใส่ logic UpdateItemCommand จริงภายหลังได้)
  res.status(200).json({
    message: 'Post updated successfully',
    userId,
    postId,
    caption,
    img_url
  });
};

const deletePost = async (req, res) => {
  const { userId, postId } = req.params;

  // (ใส่ logic DeleteItemCommand จริงภายหลังได้)
  res.status(200).json({
    message: `Post ${postId} of user ${userId} deleted successfully`
  });
};

module.exports = {
  receive,
  createPost,
  updatePost, // ✅ เพิ่มตรงนี้
  deletePost
};