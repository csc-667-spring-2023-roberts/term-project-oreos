const http = require("http");
const { Server } = require("socket.io");
const { JOIN_GAME, LEAVE_GAME } = require("./constants.js");

const initSockets = (app, sessionMiddleware) => {
  const server = http.createServer(app);
  const io = new Server(server);

  io.engine.use(sessionMiddleware);

  io.on("connection", (_socket) => {
    console.log("Connection");

    _socket.on(JOIN_GAME, ({ game_id, user }) => {
      _socket.join(game_id);
      const username = user?.username;
      const user_id = user?.id;
      const message = username + " joined room: " + game_id;
      _socket.username = username;
      _socket.user_id = user_id;

      const numPlayers = io.sockets.adapter.rooms.get(game_id).size;
      io.in(game_id).emit(JOIN_GAME, { message, numPlayers });
    });
  });

  app.set("io", io);

  return server;
};

module.exports = initSockets;
