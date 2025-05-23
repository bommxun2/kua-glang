const express = require("express");
const router = express.Router();

const getRanking = require("../controllers/rank/getRanking.controller");
const getFriendsRanking = require("../controllers/rank/getFriendsRanking.controller");
const getQuestList = require("../controllers/rank/getQuestList.controller");
const completeQuest = require("../controllers/rank/completeQuest.controller");
const getUserScore = require("../controllers/rank/getUserScore.controller");

router.get("/:userId", getRanking);
router.get("/friend/:userId", getFriendsRanking);
router.get("/quest/:userId", getQuestList);
router.post("/point/:userId/:qId", completeQuest);
router.get("/score/:userId", getUserScore);

module.exports = router;
