const dynamoDb = require("../../utils/database");
const { QueryCommand } = require("@aws-sdk/client-dynamodb");

const profilePosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const postsRes = await dynamoDb.send(
      new QueryCommand({
        TableName: "kua-glang",
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": { S: `USER#${userId}` },
          ":sk": { S: "POST#" },
        },
      })
    );

    const posts = postsRes.Items || [];

    const fullPosts = await Promise.all(
      posts.map(async (post) => {
        const postId = post.SK.S.split("#")[1];

        // --- Likes on post ---
        const likesRes = await dynamoDb.send(
          new QueryCommand({
            TableName: "kua-glang",
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
              ":pk": { S: `POST#${postId}` },
              ":sk": { S: "LIKE#" },
            },
          })
        );

        const likes = (likesRes.Items || []).map((like) => ({
          username: like.SK.S.split("#")[1],
        }));

        // --- Comments on post ---
        const commentsRes = await dynamoDb.send(
          new QueryCommand({
            TableName: "kua-glang",
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
              ":pk": { S: `POST#${postId}` },
              ":sk": { S: "COMMENT#" },
            },
          })
        );

        const comments = await Promise.all(
          (commentsRes.Items || []).map(async (comment) => {
            const cId = comment.SK.S.split("#")[1];

            // Likes on comment
            const commentLikesRes = await dynamoDb.send(
              new QueryCommand({
                TableName: "kua-glang",
                KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
                ExpressionAttributeValues: {
                  ":pk": { S: `COMMENT#${cId}` },
                  ":sk": { S: "LIKE#" },
                },
              })
            );

            return {
              cId,
              username: comment.userId?.S || "unknown",
              caption: comment.content?.S || "",
              comment_at: comment.comment_at?.S || null,
              like_count: (commentLikesRes.Items || []).length,
            };
          })
        );

        return {
          postId,
          username: userId,
          caption: post.caption?.S || "",
          img_url: post.img_url?.S || "",
          created_at: post.created_at?.S || "",
          like: likes,
          comment: comments,
        };
      })
    );

    return res.status(200).json(fullPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = profilePosts;
