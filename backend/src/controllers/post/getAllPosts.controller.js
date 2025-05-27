const docClient = require("../../utils/database");
const { QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = 'kua-glang';

const getAllPosts = async (req, res) => {
  try {
    const postsData = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":sk": "POST#"
      }
    }));

    const posts = postsData.Items || [];
    const fullPosts = [];
    const userCache = new Map();

    const getUsername = async (userId) => {
      if (!userId) return "Unknown";
      if (userCache.has(userId)) return userCache.get(userId);

      try {
        const userRes = await docClient.send(new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: "PK = :pk AND SK = :sk",
          ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":sk": "PROFILE"
          }
        }));
        const username = userRes.Items?.[0]?.username || "Unknown";
        userCache.set(userId, username);
        return username;
      } catch {
        return "Unknown";
      }
    };

    for (const post of posts) {
      try {
        if (!post?.PK?.startsWith("USER#") || !post?.SK?.startsWith("POST#")) {
          console.warn("🚫 ข้าม post ที่ไม่ตรงรูปแบบ:", post);
          continue;
        }

        const postId = post.SK.split("#")[1];
        const userId = post.PK.split("#")[1];

        const username = await getUsername(userId);

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
          try {
            const cid = comment.SK?.split("#")[1];
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
              cid,
              username: commentUsername,
              caption: comment.caption,
              comment_at: comment.comment_at,
              like_count: (likeCountRes.Items || []).length
            });
          } catch (err) {
            console.warn("⚠️ comment พัง", err);
          }
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
          try {
            const likedUserId = like.SK?.split("#")[1];
            const likedUsername = await getUsername(likedUserId);
            likes.push({ username: likedUsername });
          } catch (err) {
            console.warn("⚠️ like พัง", err);
          }
        }

        fullPosts.push({
          postId,
          userId,
          username,
          caption: post.caption,
          created_at: post.created_at,
          img_url: post.img_url,
          like: likes,
          comment: comments
        });
      } catch (err) {
        console.warn("⚠️ post พัง", err);
        continue;
      }
    }

    res.json(fullPosts);
  } catch (err) {
    console.error("🔥 getAllPosts ล้มเหลว:", err);
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
};

module.exports = getAllPosts;


// const docClient = require("../../utils/database");
// const { QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

// const TABLE_NAME = 'kua-glang';

// const getAllPosts = async (req, res) => {
//   try {
//     const postsData = await docClient.send(new ScanCommand({
//       TableName: TABLE_NAME,
//       FilterExpression: "begins_with(SK, :sk)",
//       ExpressionAttributeValues: {
//         ":sk": "POST#"
//       }
//     }));

//     const posts = postsData.Items || [];
//     const fullPosts = [];
//     const userCache = new Map(); 


//     const getUsername = async (userId) => {
//       if (userCache.has(userId)) {
//         return userCache.get(userId);
//       }
//       const userRes = await docClient.send(new QueryCommand({
//         TableName: TABLE_NAME,
//         KeyConditionExpression: "PK = :pk AND SK = :sk",
//         ExpressionAttributeValues: {
//           ":pk": `USER#${userId}`,
//           ":sk": "PROFILE"
//         }
//       }));
//       const username = userRes.Items?.[0]?.username || "Unknown";
//       userCache.set(userId, username);
//       return username;
//     };

//     for (const post of posts) {
//       const postId = post.SK.split("#")[1];
//       const userId = post.PK.split("#")[1]; 

//       const username = await getUsername(userId);

//       const commentRes = await docClient.send(new QueryCommand({
//         TableName: TABLE_NAME,
//         KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
//         ExpressionAttributeValues: {
//           ":pk": `POST#${postId}`,
//           ":sk": "COMMENT#"
//         }
//       }));

//       const comments = [];
//       for (const comment of (commentRes.Items || [])) {
//         const cid = comment.SK.split("#")[1];
//         const commentUsername = await getUsername(comment.userId);


//         const likeCountRes = await docClient.send(new QueryCommand({
//           TableName: TABLE_NAME,
//           KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
//           ExpressionAttributeValues: {
//             ":pk": `COMMENT#${cid}`,
//             ":sk": "LIKE#"
//           }
//         }));

//         comments.push({
//           cid,
//           username: commentUsername,
//           caption: comment.caption,
//           comment_at: comment.comment_at,
//           like_count: (likeCountRes.Items || []).length
//         });
//       }


//       const likeRes = await docClient.send(new QueryCommand({
//         TableName: TABLE_NAME,
//         KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
//         ExpressionAttributeValues: {
//           ":pk": `POST#${postId}`,
//           ":sk": "LIKE#"
//         }
//       }));

//       const likes = [];
//       for (const like of (likeRes.Items || [])) {
//         const likedUserId = like.SK.split("#")[1];
//         const likedUsername = await getUsername(likedUserId);
//         likes.push({ username: likedUsername });
//       }

//       fullPosts.push({
//         postId,
//         userId,
//         username,
//         caption: post.caption,
//         created_at: post.created_at,
//         img_url: post.img_url,
//         like: likes,
//         comment: comments
//       });
//     }

//     res.json(fullPosts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching posts", error: err });
//   }
// };

// module.exports = getAllPosts;
