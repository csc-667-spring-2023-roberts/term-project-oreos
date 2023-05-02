const express = require("express");
const { isAuthenticated } = require("../../middleware/auth.js");

const router = express.Router();

router.get("/:id", (_request, response) => {
  const { id } = _request.params;

  response.render("waitingroom", { id, title: "Term Project Oreos" });
});

module.exports = router;
