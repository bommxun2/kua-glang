const client = require("../../utils/database");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'kua-glang';

const getPostsFromFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const followingRes = await docClient.send(new QueryCommand({
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

    for (const followId of friendUserIds) {
      const postRes = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `USER#${followId}`,
          ":sk": "POST#"
        }
      }));
      allPosts.push(...(postRes.Items || []));
    }


    const userCache = new Map();

    const getUsername = async (uid) => {
      if (userCache.has(uid)) return userCache.get(uid);
      const res = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND SK = :sk",
        ExpressionAttributeValues: {
          ":pk": `USER#${uid}`,
          ":sk": "PROFILE"
        }
      }));
      const username = res.Items?.[0]?.username || "Unknown";
      userCache.set(uid, username);
      return username;
    };

    const fullPosts = [];

    for (const post of allPosts) {
      const postId = post.SK.split("#")[1];
      const userId = post.PK.split("#")[1];
      const postUsername = await getUsername(post.userId);

      const commentRes = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `POST#${postId}`,
          ":sk": "COMMENT#"
        }
      }));

      const comments = [];

      for (const comment of (commentRes.Items || [])) {
        const cid = comment.SK.split("#")[1];
        const commentUsername = await getUsername(comment.userId);

        const likeCountRes = await docClient.send(new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
          ExpressionAttributeValues: {
            ":pk": `COMMENT#${cid}`,
            ":sk": "LIKE#"
          }
        }));

        comments.push({
          cid: cid,
          username: commentUsername,
          caption: comment.caption,
          comment_at: comment.comment_at,
          like_count: (likeCountRes.Items || []).length
        });
      }

      const likeRes = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `POST#${postId}`,
          ":sk": "LIKE#"
        }
      }));

      const likes = [];
      for (const like of (likeRes.Items || [])) {
        const likedUserId = like.SK.split("#")[1];
        const likedUsername = await getUsername(likedUserId);
        likes.push({ username: likedUsername });
      }

      fullPosts.push({
        postId: postId,
        userId: userId,
        username: postUsername,
        caption: post.caption,
        created_at: post.created_at,
        img_url: post.img_url,
        like: likes,
        comment: comments
      });
    }
    console.log(fullPosts)
    res.json(fullPosts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching following posts", error: err });
  }
};

module.exports = getPostsFromFollowing;
