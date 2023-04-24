const express = require("express");
const { signin, signup } = require("../controllers/users.js");

const router = express.Router();
router.post("/signin", signin);
router.post("/register", signup);

module.exports = router;
