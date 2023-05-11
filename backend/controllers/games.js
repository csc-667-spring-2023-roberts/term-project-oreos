const {
  CHAT,
  CREATE_GAME,
  START_GAME,
  PLAY_CARD,
  DRAW_CARD,
} = require("../sockets/constants.js");
const fs = require("fs");
const path = require("path");
const Game = {};
const GAMECHAT = require("../db/gamechat.js");
const Games = require("../db/games.js");

let top_deck = "";
let top_discard = "";

let deck = [];
let discardPile = [];
let players = [];
let opponents = [];

const emptyCards = () => {
  deck = [];
  opponents = [];
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
  const game_title = gametitle;
  const users_required = count;

  const { id: game_id } = await Games.create(
    game_title,
    false,
    "0-0",
    "0-1",
    0,
    users_required
  );
  console.log("game created");
  console.log(game_id);

  io.emit(CREATE_GAME, { gametitle, count, user_id, game_id, ongoing: false });
  res.send({
    game_id: game_id,
    gametitle: gametitle,
    ongoing: false,
    player_count: count,
    user_id: user_id,
    status: 201,
  });
};

Game.startGame = async (req, res) => {
  emptyCards();

  // check if game already started by checking db if so then skip card setup
  // if player is joining current game then setup only their hand

  const user_id = 1;
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
    { name: "Tom", hand: [], user_id: 1 },
    { name: "Bob", hand: [], user_id: 2 },
  ];

  const cardsInHand = 7;
  for (let i = 0; i < numPlayers; i++) {
    if (user_id !== players[i].user_id) {
      opponents.push({
        name: players[i].name,
        hand: new Array(7).fill("back.png"),
        user_id: players[i].user_id,
      });
    }
    for (let j = 0; j < cardsInHand; j++) {
      players[i].hand.push(deck.pop());
    }
  }

  let playerInfo = [];
  for (let i = 0; i < players.length; i++) {
    if (user_id === players[i].user_id) {
      playerInfo = players[i];
    }
  }

  discardPile.push(deck.pop());

  io.in(game_id).emit(START_GAME, { deck, discardPile, game_id, opponents });
  res.send({
    message: "Game started",
    discardPile: discardPile,
    deck: deck,
    playersCount: numPlayers,
    playerInfo: playerInfo,
    opponents: opponents,
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

Game.drawCard = (req, res) => {
  const { game_id, user_id } = req.body;
  const io = req.app.get("io");

  // get current player's turn from db
  let playerInfo = {};
  let playerInfoNewCards = {};

  for (let i = 0; i < players.length; i++) {
    if (user_id === players[i].user_id) {
      playerInfo = players[i];
      playerInfoNewCards = {
        name: players[i].name,
        hand: [],
        user_id: players[i].user_id,
      };
      break;
    }
  }

  // penalty did not call uno
  if (playerInfo.hand.length === 1) {
    for (let i = 0; i < 2; i++) {
      const card = deck.pop();
      playerInfo.hand.push(card);
      playerInfoNewCards.hand.push(card);
    }

    res.send({
      message: "Drawn two cards",
      playerInfo: playerInfo,
      playerInfoNewCards: playerInfoNewCards,
      numPlayerCards: playerInfo.hand.length,
      status: 200,
    });
    return;
  }

  const card = deck.pop();
  playerInfo.hand.push(card);
  playerInfoNewCards.hand.push(card);

  if (deck.length <= 0) {
    const cards = shuffleCards(discardPile);
    deck = cards;
    discardPile = [deck.pop()];
  }

  io.in(game_id).emit(DRAW_CARD, { game_id, user_id, discardPile, deck });

  res.send({
    message: "Drawn card: " + card,
    playerInfo: playerInfo,
    playerInfoNewCards: playerInfoNewCards,
    numPlayerCards: playerInfo.hand.length,
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

  try {
    const room_id = game_id;
    await GAMECHAT.create(username, message, room_id);
    io.in(game_id).emit(CHAT, { message, username });
    res.send({ message: message, username: username, status: 200 });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error sending message", status: 500 });
  }
};

Game.getAllMessages = async (req, res) => {
  const { game_id } = req.params;

  try {
    const messageArray = await GAMECHAT.get(game_id);
    res.send({ messageArray: messageArray, status: 200 });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error getting all messages", status: 500 });
  }
};

Game.saveGameState = async (req, res) => {
  // TODO implement
  res.send({ message: "Game state saved" });
};

Game.getGameState = async (req, res) => {
  // TODO implement
  res.send({ message: "Game state retrieved" });
};

Game.getGameSession = async (req, res) => {
  // res.send({ game: req.session.game });
  res.send({ game: { game_id: 1 } });
};

module.exports = Game;
