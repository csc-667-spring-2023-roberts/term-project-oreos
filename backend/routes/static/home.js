const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  response.render("home", { title: "Term Project Oreos" });
});

module.exports = router;
