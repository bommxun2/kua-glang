const express = require("express");
const router = express.Router();

const generateUploadUrl = require("../controllers/api/generateUploadUrl.controller");

router.post("/upload-url", generateUploadUrl);

module.exports = router;
