const express = require("express");
const router = express.Router();

const receive = require("../controllers/share/receive.controller");

router.get("/receive/:userId", receive);

module.exports = router;
