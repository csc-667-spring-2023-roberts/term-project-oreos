const express = require("express");

const router = express.Router();

router.get("/", (_request, response) => {
  response.render("lobby", { title: "Term Project Oreos" });
});

module.exports = router;
