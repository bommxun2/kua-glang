const client = require("../../utils/database");
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const docClient = DynamoDBDocumentClient.from(client);
const { QueryCommand,ScanCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME =  'kua-glang';

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

        // 2. For each post, gather comments & likes
        const fullPosts = await Promise.all(posts.map(async (post) => {
            const postId = post.SK.split("#")[1];

            // 2.1 Comments
            const commentRes = await docClient.send(new QueryCommand({
                TableName: TABLE_NAME,
                KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
                ExpressionAttributeValues: {
                    ":pk": `POST#${postId}`,
                    ":sk": "COMMENT#"
                }
            }));

            const comments = await Promise.all((commentRes.Items || []).map(async (comment) => {
                const commentId = comment.SK.split("#")[1];

                // Like count on comment
                const likeCountRes = await docClient.send(new QueryCommand({
                    TableName: TABLE_NAME,
                    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
                    ExpressionAttributeValues: {
                        ":pk": `COMMENT#${commentId}`,
                        ":sk": "LIKE#"
                    }
                }));

                return {
                    cId: commentId,
                    username: comment.username,
                    caption: comment.caption,
                    comment_at: comment.comment_at,
                    like_count: (likeCountRes.Items || []).length,
                };
            }));

            // 2.2 Likes on Post
            const likeRes = await docClient.send(new QueryCommand({
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
        console.log("DynamoDB endpoint:", docClient.config.endpoint || "Using AWS default");


        res.json(fullPosts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching posts", error: err });
    }
};

module.exports =  getAllPosts ;
