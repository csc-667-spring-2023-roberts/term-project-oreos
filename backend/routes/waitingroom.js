const express = require("express");
const { checkPlayerCounts } = require("../controllers/waitingroom.js");

const router = express.Router();
router.get("/:game_id", checkPlayerCounts);

module.exports = router;
