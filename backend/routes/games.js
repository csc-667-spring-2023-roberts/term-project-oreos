const express = require("express");
const {
  createGame,
  startGame,
  endGame,
  playCard,
  callUno,
  sendMessage,
  saveGameState,
  getGameState,
  getAllGames,
} = require("../controllers/games.js");

const router = express.Router();
router.post("/create", createGame);
router.post("/:game_id/start", startGame);
router.post("/:game_id/end", endGame);
router.put("/:game_id/play", playCard);
router.put("/:game_id/uno", callUno);
router.post("/:game_id/chat", sendMessage);
router.put("/:game_id/state", saveGameState);
router.get("/:game_id/state", getGameState);
router.get("/all-games", getAllGames);

module.exports = router;
