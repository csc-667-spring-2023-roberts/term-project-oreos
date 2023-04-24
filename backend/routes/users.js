const express = require("express");
const { signin, signup, signout } = require("../controllers/users.js");

const router = express.Router();
router.post("/signin", signin);
router.post("/register", signup);

module.exports = router;
