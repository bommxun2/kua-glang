const express = require('express');
const router = express.Router();

const receive = require("../controllers/post/receive.controller")

router.post('/receive/:userId', receive);

module.exports = router;