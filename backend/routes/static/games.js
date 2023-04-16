const express = require("express");

const router = express.Router();

router.get("/:id", (request, response) => {
  const { id } = request.params;

  response.render("games", { id, title: "Term Project Oreo" });
});

module.exports = router;
