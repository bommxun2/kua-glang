const express = require("express");
const router = express.Router();

const login = require("../controllers/auth/login.controller");
const register = require("../controllers/auth/register.controller");

router.post("/login", login);
router.post("/register", register);

module.exports = router;
