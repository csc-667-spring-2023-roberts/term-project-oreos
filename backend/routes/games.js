const express = require("express");
const {
  createGame,
  startGame,
  endGame,
  playCard,
  drawCard,
  callUno,
  sendMessage,
  getAllMessages,
  saveGameState,
  getGameState,
  getGameSession,
} = require("../controllers/games.js");

const {
  sendMessageLobby,
  getMessageLobby,
  getAllGames,
} = require("../controllers/lobby.js");

const router = express.Router();
router.post("/create", createGame);
router.post("/lobby-chat", sendMessageLobby);
router.get("/lobby-chat", getMessageLobby);
router.post("/:game_id/start", startGame);
router.post("/:game_id/end", endGame);
router.put("/:game_id/play", playCard);
router.put("/:game_id/draw", drawCard);
router.put("/:game_id/uno", callUno);
router.post("/:game_id/chat", sendMessage);
router.get("/:game_id/chat", getAllMessages);
router.put("/:game_id/state", saveGameState);
router.get("/:game_id/state", getGameState);
router.get("/all-games", getAllGames);
router.get("/game-session", getGameSession);

module.exports = router;
