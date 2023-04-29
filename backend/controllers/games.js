const { CHAT, CREATE_GAME } = require("../sockets/constants.js");
const Game = {};

Game.createGame = async (req, res) => {
  const { gametitle, count, user_id } = req.body;
  const io = req.app.get("io");

  if (!user_id) {
    res.send({ message: "Bad Request", status: 400 });
    return;
  }

  if (!gametitle || gametitle.trim().length === 0 || !count) {
    res.send({ message: "Please fill out game info", status: 400 });
    return;
  }

  // Insert info into db
  // use db column id as game id
  const game_id = 1;

  io.emit(CREATE_GAME, { gametitle, count, user_id, game_id });
  res.send({
    game_id: game_id,
    gametitle: gametitle,
    player_count: count,
    user_id: user_id,
    status: 201,
  });
};

Game.startGame = async (req, res) => {
  // TODO implement
  res.send({ message: "Game started" });
};

Game.endGame = async (req, res) => {
  // TODO implement
  res.send({ message: "Game ended" });
};

Game.playCard = async (req, res) => {
  // TODO implement
  res.send({ message: "Play card" });
};

Game.callUno = async (req, res) => {
  // TODO implement
  res.send({ message: "Call Uno" });
};

Game.sendMessage = async (req, res) => {
  const { message, user_id, username, game_id } = req.body;
  const io = req.app.get("io");

  if (!user_id || !username) {
    res.send({ message: "Bad Request", status: 400 });
    return;
  }

  if (!message || message.trim().length === 0) {
    res.send({ message: "Please type a message", status: 400 });
    return;
  }
  // insert info into db

  io.in(game_id).emit(CHAT, { message, username });
  res.send({ message: message, username: username, status: 200 });
};

Game.saveGameState = async (req, res) => {
  // TODO implement
  res.send({ message: "Game state saved" });
};

Game.getGameState = async (req, res) => {
  // TODO implement
  res.send({ message: "Game state retrieved" });
};

Game.getAllGames = async (req, res) => {
  // TODO implement
  res.send({ message: "Retrieved all games" });
};

Game.getGameSession = async (req, res) => {
  // res.send({ game: req.session.game });
  res.send({ game: { game_id: 1 } });
};

module.exports = Game;
