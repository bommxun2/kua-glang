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

router.get('/', getAllPosts);
router.get('/:userId', getPostsFromFollowing);
router.post('/:userId', createPost);
router.put('/:userId/:postId', updatePost);
router.delete('/:userId/:postId', deletePost);
router.post('/like/:userId/:postId', likePost);
router.post('/post/:postId/comment/:userId', commentPost);
router.post('/post/:cid/comment/:userId', likeComment);


module.exports = router;
