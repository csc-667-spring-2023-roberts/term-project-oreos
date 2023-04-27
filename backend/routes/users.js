const express = require("express");
const {
  signin,
  signup,
  signout,
  getUserSession,
} = require("../controllers/users.js");

const router = express.Router();
router.post("/signin", signin);
router.post("/register", signup);
router.get("/signout", signout);
router.get("/user-session", getUserSession);

module.exports = router;
