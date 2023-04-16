const express = require("express");

const router = express.Router();

router.get("/sign-up", (_request, response) => {
  response.render("sign-up", { title: "Term Project Oreo" });
});

router.get("/login", (_request, response) => {
  response.render("login", { title: "Term Project Oreo" });
});

module.exports = router;
