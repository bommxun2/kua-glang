const client = require("../../utils/database");
const { DynamoDBDocumentClient, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "kua-glang";

const getPostsFromFollowing = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }


    const followingRes = await client.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":sk": "FOLLOWING#"
      }
    }));

    const followings = followingRes.Items || [];
    const friendUserIds = followings.map(item => item.SK.split("#")[1]);

    if (friendUserIds.length === 0) {
      return res.json([]);
    }

    const allPosts = [];

    for (const follow_id of friendUserIds) {
      const postRes = await client.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `USER#${follow_id}`,
          ":sk": "POST#"
        }
      }));

      allPosts.push(...(postRes.Items || []));
    }

    const fullPosts = await Promise.all(allPosts.map(async (post) => {
      const postId = post.SK.split("#")[1];

      const commentRes = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `POST#${postId}`,
          ":sk": "COMMENT#"
        }
      }));

      const comments = await Promise.all((commentRes.Items || []).map(async (comment) => {
        const cid = comment.SK.split("#")[1];

        const likeCountRes = await docClient.send(new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
          ExpressionAttributeValues: {
            ":pk": `COMMENT#${cid}`,
            ":sk": "LIKE#"
          }
        }));

        return {
          cid: cid,
          username: comment.username,
          caption: comment.caption,
          comment_at: comment.comment_at,
          like_count: (likeCountRes.Items || []).length,
        };
      }));

      const likeRes = await client.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `POST#${postId}`,
          ":sk": "LIKE#"
        }
      }));

      const likes = (likeRes.Items || []).map(like => ({
        username: like.username
      }));

      return {
        postId: postId,
        userId: post.userId,
        username: post.username,
        caption: post.caption,
        created_at: post.created_at,
        img_url: post.img_url,
        like: likes,
        comment: comments
      };
    }));

    res.json(fullPosts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching following posts", error: err });
  }
};

module.exports = getPostsFromFollowing;
