const express = require("express");
const { isAuthenticated } = require("../../middleware/auth.js");

const router = express.Router();

router.get("/:id", isAuthenticated, (_request, response) => {
  const user = _request.session.user;
  const { id } = _request.params;

  response.render("waitingroom", {
    id,
    user: user,
    title: "Term Project Oreos",
  });
});

module.exports = router;
