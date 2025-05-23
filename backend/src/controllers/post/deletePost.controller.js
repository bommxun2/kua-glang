const {
  DeleteItemCommand,
  QueryCommand,
} = require('@aws-sdk/client-dynamodb');

const client = require("../../utils/database");


const deletePost = async (req, res) => {
  const { userId, postId } = req.params;

  try {
    // Check is that the owner of the post
    const getPost = await client.send(new QueryCommand({
      TableName: 'kua-glang',
      KeyConditionExpression: 'PK = :pk AND SK = :sk',
      ExpressionAttributeValues: {
        ':pk': { S: `USER#${userId}` },
        ':sk': { S: `POST#${postId}` },
      }
    }));

    if (getPost.Count === 0) {
      return res.status(403).json({ error: 'You are not the owner of this post or post not found.' });
    }

    // delete post
    await client.send(new DeleteItemCommand({
      TableName: 'kua-glang',
      Key: {
        PK: { S: `USER#${userId}` },
        SK: { S: `POST#${postId}` },
      }
    }));

    // find Like and Comment
    const postRelatedItems = await client.send(new QueryCommand({
      TableName: 'kua-glang',
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: `POST#${postId}` },
      },
    }));

    const commentIds = [];

    for (const item of postRelatedItems.Items) {
      const sk = item.SK.S;
      if (sk.startsWith('COMMENT#')) {
        commentIds.push(sk.split('#')[1]);
      }

      await client.send(new DeleteItemCommand({
        TableName: 'kua-glang',
        Key: {
          PK: { S: `POST#${postId}` },
          SK: { S: sk },
        }
      }));
    }

    // 4. delete like in comment
    for (const cid of commentIds) {
      const likesOnComment = await client.send(new QueryCommand({
        TableName: 'kua-glang',
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: `COMMENT#${cid}` },
        },
      }));

      for (const item of likesOnComment.Items) {
        await client.send(new DeleteItemCommand({
          TableName: 'kua-glang',
          Key: {
            PK: { S: `COMMENT#${cid}` },
            SK: { S: item.SK.S },
          },
        }));
      }
    }

    return res.json({ message: 'Delete post and all related data successfully.' });

  } catch (err) {
    console.error('Delete post failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = deletePost;