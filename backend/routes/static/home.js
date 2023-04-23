const express = require("express");
const router = express.Router();
const { redirectToLobby } = require("../../middleware/auth.js");

router.get("/", (request, response) => {
  response.render("home", { title: "Term Project Oreos" });
});

module.exports = router;
