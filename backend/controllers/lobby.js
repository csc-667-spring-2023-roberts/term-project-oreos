const { CHAT } = require("../sockets/constants.js");
const Lobby = {};

Lobby.sendMessageLobby = (req, res) => {
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

module.exports = Lobby;
