const express = require("express");
const router = express.Router();

const receive = require("../controllers/share/receive.controller");
const createShareFood = require("../controllers/share/createShare.controller")
const deleteShare = require("../controllers/share/deleteShare.controller")
const updateShare = require("../controllers/share/updateShare.controller")
const  getShareInterest  = require("../controllers/share/interestedList.controller");
const addInterest = require("../controllers/share/addInterest.controller");
const receiveShare = require("../controllers/share/approvedShare.controller")
const getSharesByUser = require("../controllers/share/getMyshare.controller")
const getAllShares = require("../controllers/share/getShare.controller")

router.get("/receive/:userId", receive);
router.post('/:shareId/interest/:userId', addInterest);
router.post('/:shareId/receive/:userId', receiveShare)
router.get('/:shareId/interest/:userId', getShareInterest);
router.post('/:userId/:foodId', createShareFood);
router.delete('/:shareId', deleteShare);
router.put('/:userId/:foodId/:shareId', updateShare);
router.get('/:userId', getSharesByUser);
router.get('/', getAllShares);

module.exports = router;