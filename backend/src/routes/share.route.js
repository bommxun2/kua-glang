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
router.post('/user/:userId/:foodId', createShareFood); // เพิ่มอาหารที่จะแบ่งปันที่มีอยู่แล้ว
router.delete('/:shareId', deleteShare);
router.put('/user/:userId/:foodId/:shareId', updateShare); // แก้ไขอาหารที่จะแบ่งปัน
router.get('/user/:userId', getSharesByUser); // แสดงรายการแบ่งปันของฉัน
router.get('/', getAllShares);

module.exports = router;