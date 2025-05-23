const express = require('express');
const router = express.Router();

const receive = require("../controllers/post/receive.controller")
const createPost = require("../controllers/post/post.controller")
const updatePost = require("../controllers/post/updatePost.controller")
const deletePost = require("../controllers/post/deletePost.controller")

router.post('/receive/:userId', receive);
router.post('/:userId', createPost);
router.put('/:userId/:postId', updatePost);
router.delete('/:userId/:postId', deletePost);

module.exports = router;
