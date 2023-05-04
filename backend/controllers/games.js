const {
  CHAT,
  CREATE_GAME,
  START_GAME,
  PLAY_CARD,
} = require("../sockets/constants.js");
const fs = require("fs");
const path = require("path");
const Game = {};

let deck = [];
let discardPile = [];
let players = [];

const emptyCards = () => {
  deck = [];
  discardPile = [];
};

const shuffleCards = (cards) => {
  let temp = null;
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }

  return cards;
};
const getCards = () => {
  const folderPath = path.join(__dirname, "..", "static", "images");
  const cards = [];

  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        files.forEach((file) => {
          cards.push(file);
        });
        resolve(cards);
      }
    });
  });
};

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
  emptyCards();

  // check if game already started by checking db if so then skip card setup

  const { game_id } = req.body;

  const io = req.app.get("io");

  if (!io.sockets.adapter.rooms.get(+game_id)) {
    res.send({ message: "An error occured", status: 500 });
    return;
  }

  const numPlayers = io.sockets.adapter.rooms.get(game_id).size;

  if (numPlayers < 2) {
    res.send({ message: "Need at least two players", status: 400 });
    return;
  }

  let cards = await getCards();

  cards = shuffleCards(cards);

  for (let i = 0; i < cards.length; i++) {
    if (cards[i] === "back.png") {
      continue;
    }

    deck.push(cards[i]);
  }

  //TODO get players from db
  players = [
    { name: "John", hand: [], user_id: 1 },
    { name: "Bob", hand: [], user_id: 2 },
    { name: "Tom", hand: [], user_id: 3 },
  ];

  const cardsInHand = 7;
  for (let i = 0; i < numPlayers; i++) {
    for (let j = 0; j < cardsInHand; j++) {
      players[i].hand.push(deck.pop());
    }
  }

  //get user session id
  const user_id = 1;
  let playerInfo = [];
  for (let i = 0; i < players.length; i++) {
    if (user_id === players[i].user_id) {
      playerInfo = players[i];
    }
  }

  discardPile.push(deck.pop());
  io.in(game_id).emit(START_GAME, { deck, discardPile, game_id });
  res.send({
    message: "Game started",
    discardPile: discardPile,
    deck: deck,
    playersCount: numPlayers,
    playerInfo: playerInfo,
    status: 200,
  });
};

Game.endGame = async (req, res) => {
  // TODO implement
  res.send({ message: "Game ended" });
};

Game.playCard = async (req, res) => {
  // get player from db
  // make sure user is in the game
  // make sure player turn

  const { game_id, user_id, card_id } = req.body;
  const io = req.app.get("io");

  let playerInfo = [];

  for (let i = 0; i < players.length; i++) {
    if (user_id === players[i].user_id) {
      let idx = Array.from(players[i].hand.indexOf(card_id));
      players[i].hand.splice(idx, 1);
      playerInfo = players[i];
      break;
    }
  }

  discardPile.push(card_id);
  io.in(game_id).emit(PLAY_CARD, { card_id, game_id, user_id, discardPile });
  res.send({
    message: "Played card: " + card_id,
    playerInfo: playerInfo,
    status: 200,
  });
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
