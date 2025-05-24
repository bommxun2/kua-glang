const express = require("express");
const router = express.Router();

const createPost = require("../controllers/post/post.controller");
const updatePost = require("../controllers/post/updatePost.controller");
const deletePost = require("../controllers/post/deletePost.controller");
const deleteComment = require("../controllers/post/deleteComment.controller");
const updateComment = require("../controllers/post/updateComment.controller");

router.post("/:userId", createPost);
router.put("/:userId/:postId", updatePost);
router.delete("/:userId/:postId", deletePost);
router.delete("/:postId/comment/:cId", deleteComment);
router.put("/:postId/comment/:cId", updateComment);

module.exports = router;
