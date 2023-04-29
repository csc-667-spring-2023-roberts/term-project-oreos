const http = require("http");
const { Server } = require("socket.io");
const { JOIN_GAME } = require("./constants.js");

const initSockets = (app, sessionMiddleware) => {
  const server = http.createServer(app);
  const io = new Server(server);

  io.engine.use(sessionMiddleware);

  io.on("connection", (_socket) => {
    console.log("Connection");

    _socket.on(JOIN_GAME, ({ game_id }) => {
      _socket.join(game_id);
      const message = "Joined room: " + game_id;
      io.in(game_id).emit(JOIN_GAME, { message });
    });
  });

  app.set("io", io);

  return server;
};

module.exports = initSockets;
