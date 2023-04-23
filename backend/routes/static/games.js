const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/auth.js");

router.get("/:id", (request, response) => {
  const { id } = request.params;

  response.render("games", { id, title: "Term Project Oreos" });
});

module.exports = router;
