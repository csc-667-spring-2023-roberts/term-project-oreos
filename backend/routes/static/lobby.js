const express = require("express");
const { isAuthenticated } = require("../../middleware/auth.js");

const router = express.Router();

router.get("/", isAuthenticated, (_request, response) => {
  const user_id = _request.session.user ? _request.session.user.id : "";
  response.render("lobby", { user_id: user_id, title: "Term Project Oreos" });
});

module.exports = router;
