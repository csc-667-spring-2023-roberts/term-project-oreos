const {
  CHAT,
  CREATE_GAME,
  START_GAME,
  PLAY_CARD,
  DRAW_CARD,
} = require("../sockets/constants.js");
const Game = {};
const GAMECHAT = require("../db/gamechat.js");
const Games = require("../db/games.js");

let top_deck = "";
let top_discard = "";
let players = [];

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
const getCards = async () => {
  const cardsArr = [];

  const cards = await Games.getAllCards();

  for (const card of cards) {
    cardsArr.push({
      id: card.card_id,
      name: card.card_color + "-" + card.card_number + ".png",
    });
  }

  return cardsArr;
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
  const { game_id, user_id } = req.body;
  const io = req.app.get("io");
  const numPlayers = io.sockets.adapter.rooms.get(game_id).size;

  try {
    let users_required = await Games.getNumberOfPlayers(game_id);
    users_required = users_required?.users_required || 2;

    if (numPlayers < users_required) {
      res.send({
        url: `/lobby`,
        message: `Need at least ${users_required} players`,
        status: 400,
      });
      return;
    }

    let isOngoingGame = await Games.isGameStarted(game_id);
    isOngoingGame = isOngoingGame?.ongoing || false;

    let isPlayerOngoing = await Games.isPlayerStarted(user_id, game_id);
    isPlayerOngoing = isPlayerOngoing?.ongoing || false;

    if (isOngoingGame && isPlayerOngoing) {
      const userCards = await Games.getAllUserCards(user_id, game_id);
      const gameState = await Games.getGameState(game_id);

      const userCardsObj = {};
      userCards.forEach((elem) => {
        userCardsObj[elem.card_id] = elem;
      });

      let cardsArr = await getCards();
      let cards = shuffleCards(cardsArr);

      const playerInfo = {
        name: req.session.user?.username,
        user_id: user_id,
        hand: [],
      };

      cards.forEach((card) => {
        if (card.id in userCardsObj) {
          playerInfo.hand.push(card.name);
        }
      });

      let foundExistingPlayer = false;

      for (let i = 0; i < players.length; i++) {
        if (players[i].user_id === user_id) {
          foundExistingPlayer = true;
          players[i].hand = playerInfo.hand;
          break;
        }
      }

      if (!foundExistingPlayer) {
        players.push(playerInfo);
      }

      top_deck = gameState.top_deck + ".png";
      top_discard = gameState.top_discard + ".png";

      io.in(game_id).emit(START_GAME, {
        top_deck,
        top_discard,
        game_id,
        players,
      });
      res.send({
        message: "Game already started",
        status: 200,
        ongoing: isOngoingGame,
        playerInfo: playerInfo,
        players,
      });
      return;
    }

    if (numPlayers < users_required) {
      res.send({
        url: `/lobby`,
        message: `Need at least ${users_required} players`,
        status: 400,
      });
      return;
    }

    const gameState = await Games.getGameState(game_id);
    top_deck = gameState.top_deck + ".png";
    top_discard = gameState.top_discard + ".png";

    if (!io.sockets.adapter.rooms.get(+game_id)) {
      res.send({ message: "An error occured", status: 500 });
      return;
    }

    let cardsArr = await getCards();
    let cards = shuffleCards(cardsArr);
    const player = {
      name: req.session.user?.username,
      user_id: user_id,
      hand: [],
    };

    player.hand = [];
    await Games.createGameUser(game_id, user_id, true, 0);

    const cardsInHand = 7;
    for (let i = 0; i < cardsInHand; i++) {
      const poppedCard = cards.pop();
      const card_id = poppedCard.id;
      const card_name = poppedCard.name;
      await Games.createUserCard(game_id, user_id, card_id);
      player.hand.push(card_name);
    }

    let playerInfo = player;
    let ongoingUpdated = await Games.setGameOngoing(true, game_id);

    ongoingUpdated = ongoingUpdated?.ongoing || false;
    players.push(player);

    io.in(game_id).emit(START_GAME, {
      top_deck,
      top_discard,
      game_id,
      players,
    });
    res.send({
      message: "Game started",
      playersCount: numPlayers,
      playerInfo: playerInfo,
      ongoingUpdated: ongoingUpdated,
      players,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error occured", status: 500 });
  }
};

Game.endGame = async (req, res) => {
  // TODO implement
  res.send({ message: "Game ended" });
};

Game.playCard = async (req, res) => {
  // make sure user is in the game
  // make sure player turn
  // make sure player can play the card
  // handle special hards

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

  top_discard = card_id;

  io.in(game_id).emit(PLAY_CARD, { card_id, game_id, user_id, top_discard });
  res.send({
    message: "Played card: " + card_id,
    playerInfo: playerInfo,
    status: 200,
  });
};

Game.drawCard = (req, res) => {
  // make sure user is in the game
  // make sure player turn

  const { game_id, user_id } = req.body;
  const io = req.app.get("io");

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
  if (playerInfo.hand?.length === 1) {
    for (let i = 0; i < 2; i++) {
      const card = top_deck;
      playerInfo.hand?.push(card);
      playerInfoNewCards.hand?.push(card);
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

  const card = top_deck;
  playerInfo.hand?.push(card);
  playerInfoNewCards.hand?.push(card);

  //todo: placeholder, update top deck to a random card from db after player draws current card it
  top_deck = "2-5.png";

  io.in(game_id).emit(DRAW_CARD, { game_id, user_id, top_discard, top_deck });

  res.send({
    message: "Drawn card: " + card,
    playerInfo: playerInfo,
    playerInfoNewCards: playerInfoNewCards,
    numPlayerCards: playerInfo.hand?.length,
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
    res.send({ message: "Error sending message", status: 500 });
  }
};

Game.getAllMessages = async (req, res) => {
  const { game_id } = req.params;

  try {
    const messageArray = await GAMECHAT.get(game_id);
    res.send({ messageArray: messageArray, status: 200 });
  } catch (err) {
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

module.exports = Game;
