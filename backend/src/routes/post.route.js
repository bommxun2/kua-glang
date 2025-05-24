const express = require("express");
const router = express.Router();

const createPost = require("../controllers/post/post.controller")
const updatePost = require("../controllers/post/updatePost.controller")
const deletePost = require("../controllers/post/deletePost.controller")
const getAllPosts = require("../controllers/post/getAllPosts.controller")
const getPostsFromFollowing = require("../controllers/post/getPostsFromFollowing.controller")
const likePost = require("../controllers/post/likePost.controller")
const commentPost = require("../controllers/post/commentPost.controller")
const likeComment = require("../controllers/post/likeComment.contoller")
const deleteComment = require("../controllers/post/deleteComment.controller");
const updateComment = require("../controllers/post/updateComment.controller");
const getFriendsAndSuggestions = require("../controllers/post/getFriendsAndSuggestions.controller");
const unfollowUser = require("../controllers/post/unfollowUser.controller");
const followUser = require("../controllers/post/followUser.controller");

router.post('/:userId', createPost);
router.put('/:userId/:postId', updatePost);
router.delete('/:userId/:postId', deletePost);
router.get('/', getAllPosts);
router.get('/:userId', getPostsFromFollowing);
router.post('/like/:userId/:postId', likePost);
router.post('/post/:postId/comment/:userId', commentPost);
router.post('/post/:cid/comment/:userId', likeComment);
router.delete("/:postId/comment/:cId", deleteComment);
router.put("/:postId/comment/:cId", updateComment);
router.get("/friend/:userId", getFriendsAndSuggestions);
router.post("/friend/:userId/:followId", followUser);
router.delete("/friend/:userId/:followId", unfollowUser);

module.exports = router;
