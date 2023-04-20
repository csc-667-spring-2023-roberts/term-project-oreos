const Game = {};

Game.createGame = async (req, res) => {
  // TODO implement
  res.send({ message: "Game created" });
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
  // TODO implement
  res.send({ message: "Sent message" });
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

module.exports = Game;
