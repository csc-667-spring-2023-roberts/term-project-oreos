const Lobby = {};

Lobby.sendMessageLobby = (req, res) => {
  const { message, user_id, username } = req.body;

  if (!user_id || !username) {
    res.send({ message: "Bad Request", status: 400 });
    return;
  }

  if (!message || message.trim().length === 0) {
    res.send({ message: "Please type a message", status: 400 });
    return;
  }
  // insert info into db

  res.send({ message: message, username: username, status: 200 });
};

module.exports = Lobby;
