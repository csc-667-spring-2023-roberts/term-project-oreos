const WaitingRoom = {};
const { REDIRECT_TO_GAME_ROOM } = require("../sockets/constants.js");

WaitingRoom.checkPlayerCounts = async (req, res) => {
  const io = req.app.get("io");
  const { game_id } = req.params;

  if (!io.sockets.adapter.rooms.get(+game_id)) {
    res.send({ message: "An error occured", status: 500 });
    return;
  }

  const numPlayers = io.sockets.adapter.rooms.get(+game_id).size;

  if (numPlayers < 2) {
    res.send({ message: "Need at least two players", status: 400 });
    return;
  }

  io.in(+game_id).emit(REDIRECT_TO_GAME_ROOM, { game_id });
  res.send({ message: "Starting game...", status: 200 });
};

module.exports = WaitingRoom;
