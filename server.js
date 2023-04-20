const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const express = require("express");
const app = express();

const homeRoutes = require("./backend/routes/static/home.js");
const gamesRoutes = require("./backend/routes/static/games.js");
const lobbyRoutes = require("./backend/routes/static/lobby.js");
const authenticationRoutes = require("./backend/routes/static/authentication.js");
const users = require("./backend/routes/users.js");
const games = require("./backend/routes/games.js");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "backend", "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "backend", "static")));

app.use("/", homeRoutes);
app.use("/games", gamesRoutes);
app.use("/lobby", lobbyRoutes);
app.use("/authentication", authenticationRoutes);
app.use("/api/users", users);
app.use("/api/games", games);

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((request, response, next) => {
  next(createError(404));
});

// const path = require("path");
// const createError = require("http-errors");
// const requestTime = require("./backend/middleware/request-time");

// const express = require("express");
// const app = express();

// app.use(morgan("dev"));

// if (process.env.NODE_ENV === "development") {
//     const livereload = require("livereload");
//     const connectLiveReload = require("connect-livereload");

//     const liveReloadServer = livereload.createServer();
//     liveReloadServer.watch(path.join(__dirname, "backend", "static"));
//     liveReloadServer.server.once("connection", () => {
//       setTimeout(() => {
//         liveReloadServer.refresh("/");
//       }, 100);
//     });

//     app.use(connectLiveReload());
//   }

// app.set("views", path.join(__dirname, "backend", "views"));
// app.set("view engine", "pug");
// app.use(express.static(path.join(__dirname, "backend", "static")));

// const PORT = process.env.PORT || 3000;

// app.use(express.static(path.join(__dirname, "backend", "static")));

// const rootRoutes = require("./backend/routes/root");

// app.use("/", rootRoutes);
// app.use(requestTime);

// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });

// app.use((request, response, next) => {
//   next(createError(404));
// });
