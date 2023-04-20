const express = require("express");

const router = express.Router();

router.get("/sign-up", (_request, response) => {
  response.render("sign-up", { title: "Term Project Oreos" });
});

router.get("/login", (_request, response) => {
  response.render("login", { title: "Term Project Oreos" });
});

module.exports = router;
