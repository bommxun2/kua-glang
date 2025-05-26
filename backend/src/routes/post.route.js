const express = require("express");
const router = express.Router();

const createPost = require("../controllers/post/post.controller");
const updatePost = require("../controllers/post/updatePost.controller");
const deletePost = require("../controllers/post/deletePost.controller");
const getAllPosts = require("../controllers/post/getAllPosts.controller");
const getPostsFromFollowing = require("../controllers/post/getPostsFromFollowing.controller");
const likePost = require("../controllers/post/likePost.controller");
const commentPost = require("../controllers/post/commentPost.controller");
const likeComment = require("../controllers/post/likeComment.contoller");
const deleteComment = require("../controllers/post/deleteComment.controller");
const updateComment = require("../controllers/post/updateComment.controller");
const getFriendsAndSuggestions = require("../controllers/post/getFriendsAndSuggestions.controller");
const unfollowUser = require("../controllers/post/unfollowUser.controller");
const followUser = require("../controllers/post/followUser.controller");

router.post("/:userId", createPost);
router.put("/:userId/:postId", updatePost);
router.delete("/:userId/:postId", deletePost);
router.get("/", getAllPosts);
router.get("/:userId", getPostsFromFollowing);
router.post("/like/:userId/:postId", likePost);
router.post("/comment-by/:userId/:postId", commentPost); // คอมเม้นโพสต์ของคนอื่น
router.post("/:cid/comment/:userId", likeComment);
router.delete("/comment/:cId/:postId", deleteComment); // ลบคอมเม้น
router.put("/comment/:cId/:postId", updateComment); // แก้ไขคอมเม้น
router.get("/friend/:userId", getFriendsAndSuggestions);
router.post("/friend/:userId/:followId", followUser);
router.delete("/friend/:userId/:followId", unfollowUser);

module.exports = router;
