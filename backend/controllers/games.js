const Game = {};

Game.createGame = async (req, res) => {
  const { gametitle, count, user_id } = req.body;

  if (!user_id || gametitle.trim().length === 0 || !count) {
    res.send({ message: "Please fill out game info" });
    return;
  }

  // Insert info into db
  // use db column id as game id

  res.send({
    message: {
      game_id: 1,
      gametitle: gametitle,
      player_count: count,
      user_id: user_id,
    },
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
