const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const client = require("../../utils/database");

const getFriendsAndSuggestions = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. หาเพื่อนที่เราติดตาม (myfriend)
    const followingRes = await client.send(
      new QueryCommand({
        TableName: "kua-glang",
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": { S: `USER#${userId}` },
          ":skPrefix": { S: "FOLLOWING#" },
        },
      })
    );

    const myFriendIds =
      followingRes.Items?.map((item) => item.SK.S.split("#")[1]) || [];

    // 2. ดึงโปรไฟล์ของ myfriend
    const myfriend = await Promise.all(
      myFriendIds.map(async (fid) => {
        const profileRes = await client.send(
          new QueryCommand({
            TableName: "kua-glang",
            KeyConditionExpression: "PK = :pk AND SK = :sk",
            ExpressionAttributeValues: {
              ":pk": { S: `USER#${fid}` },
              ":sk": { S: "PROFILE" },
            },
          })
        );

        const profile = profileRes.Items?.[0];
        return profile
          ? {
              userId: fid,
              username: profile.username?.S || "unknown",
            }
          : null;
      })
    );

    // 3. หาเพื่อนของเพื่อน (suggest_friend)
    const suggestFriendSet = new Set();

    for (const fid of myFriendIds) {
      const fFollowingRes = await client.send(
        new QueryCommand({
          TableName: "kua-glang",
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
          ExpressionAttributeValues: {
            ":pk": { S: `USER#${fid}` },
            ":skPrefix": { S: "FOLLOWING#" },
          },
        })
      );

      const fFriendIds =
        fFollowingRes.Items?.map((i) => i.SK.S.split("#")[1]) || [];

      for (const f of fFriendIds) {
        if (f !== userId && !myFriendIds.includes(f)) {
          suggestFriendSet.add(f);
        }
      }
    }

    // 4. ดึงโปรไฟล์ของ suggest_friend
    const suggest_friend = await Promise.all(
      Array.from(suggestFriendSet).map(async (sid) => {
        const profileRes = await client.send(
          new QueryCommand({
            TableName: "kua-glang",
            KeyConditionExpression: "PK = :pk AND SK = :sk",
            ExpressionAttributeValues: {
              ":pk": { S: `USER#${sid}` },
              ":sk": { S: "PROFILE" },
            },
          })
        );

        const profile = profileRes.Items?.[0];
        return profile
          ? {
              userId: sid,
              username: profile.username?.S || "unknown",
            }
          : null;
      })
    );

    return res.status(200).json({
      myfriend: myfriend.filter(Boolean),
      suggest_friend: suggest_friend.filter(Boolean),
    });
  } catch (err) {
    console.error("Error fetching friend data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getFriendsAndSuggestions;
