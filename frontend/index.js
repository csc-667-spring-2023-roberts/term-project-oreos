console.log("Hello from a bundled  assetsss.");
import io from "socket.io-client";
import { getGameId } from "./get-game-id";
import {
  CHAT,
  JOIN_GAME,
  CREATE_GAME,
  START_GAME,
  REDIRECT_TO_GAME_ROOM,
  PLAY_CARD,
  DRAW_CARD,
} from "./constants";

const socket = io();
const game_id = getGameId(document.location.pathname);

// TODO get user from session
const user = {
  name: "Tom",
  user_id: 1,
};

socket.emit(JOIN_GAME, { game_id, user });

socket.on(REDIRECT_TO_GAME_ROOM, ({ game_id }) => {
  window.location.href = `/games/${game_id}`;
});

socket.on(CREATE_GAME, ({ gametitle, count, user_id, game_id }) => {
  let gamesList = document.getElementById("games-list-id");

  if (!gamesList) {
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = `Name: <a href="/waitingroom/${game_id}">${gametitle}</a>, Players: ${count}`;
  gamesList.appendChild(li);
});

socket.on(CHAT, ({ message, username }) => {
  let chatList = document.getElementById("chat-list-id");

  if (!chatList) {
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = `${username}: ${message}`;
  chatList.appendChild(li);
});

socket.on(START_GAME, ({ deck, discardPile }) => {
  const imgPath = "../images/";

  if (
    !document.getElementById("deck-img-id") ||
    !document.getElementById("discard-img-id")
  ) {
    return;
  }

  document.getElementById("deck-img-id").src = imgPath + deck[0];
  document.getElementById("discard-img-id").src = imgPath + discardPile[0];
});

socket.on(JOIN_GAME, ({ message, numPlayers }) => {
  console.log(message);

  if (!document.getElementById("num-of-players-id")) {
    return;
  }

  if (game_id && game_id !== 0) {
    document.getElementById("num-of-players-id").innerText =
      "Number of Players: " + numPlayers;
  }
});

socket.on(PLAY_CARD, ({ card_id, game_id, user_id, discardPile }) => {
  const imgPath = "../images/";
  document.getElementById("discard-img-id").src =
    imgPath + discardPile[discardPile.length - 1];
});

socket.on(DRAW_CARD, ({ card_id, game_id, user_id, discardPile, deck }) => {
  const imgPath = "../images/";
  document.getElementById("deck-img-id").src = imgPath + deck[deck.length - 1];
});
