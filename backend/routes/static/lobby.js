const express = require("express");
const { isAuthenticated } = require("../../middleware/auth.js");

const router = express.Router();

router.get("/", (_request, response) => {
  response.render("lobby", { title: "Term Project Oreos" });
});

module.exports = router;
