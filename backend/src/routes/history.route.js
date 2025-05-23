const express = require("express");
const router = express.Router();

const getFoodUsageHistory = require("../controllers/history/getFoodUsageHistory.controller");
const getUserSharePosts = require("../controllers/history/getUserSharePosts.controller");
const getReceivedShares = require("../controllers/history/getReceivedShares.controller");

router.get("/:userId", getFoodUsageHistory);
router.get("/share/:userId", getUserSharePosts);
router.get("/receive/:userId", getReceivedShares);

module.exports = router;