const express = require("express");
const router = express.Router();

const profilePosts = require("../controllers/profile/profilePosts.controller");
const getUserProfile = require("../controllers/profile/getUserProfile.controller");
const getUserStat = require("../controllers/profile/getUserStat.controller");
const updateUserProfile = require("../controllers/profile/updateUserProfile.controller");

router.get("/:userId/post", profilePosts);
router.get("/:userId", getUserProfile);
router.get("/stat/:userId", getUserStat);
router.put("/stat/:userId", updateUserProfile);

module.exports = router;
