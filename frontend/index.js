console.log("Hello from a bundled  assetsss.");
import io from "socket.io-client";
import { getGameId } from "./get-game-id";
import { showMessage } from "./show-alert-message";
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
const imgPath = "../images/";
const user = JSON.parse(localStorage.getItem("user"));

socket.emit(JOIN_GAME, { game_id, user });

socket.on(REDIRECT_TO_GAME_ROOM, ({ game_id }) => {
  window.location.href = `/games/${game_id}`;
});

socket.on(CREATE_GAME, ({ gametitle, count, user_id, game_id, ongoing }) => {
  let gamesList = document.getElementById("games-list-id");

  if (!gamesList) {
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = `Title: <a href="/waitingroom/${game_id}">${gametitle}</a>, Players: ${count}, Started: ${ongoing}`;
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

socket.on(START_GAME, ({ top_deck, top_discard, players }) => {
  if (
    !document.getElementById("deck-img-id") ||
    !document.getElementById("discard-img-id")
  ) {
    return;
  }

  document.getElementById("deck-img-id").src = imgPath + top_deck;
  document.getElementById("discard-img-id").src = imgPath + top_discard;

  const parentHandUI = document.getElementById("opponents-hand-parent-id");
  parentHandUI.innerHTML = "";

  players.forEach((player) => {
    if (user.id !== player.user_id) {
      let playerHandUI = document.createElement("div");
      playerHandUI.innerHTML = "";
      playerHandUI.id = "opponent-hand-id";
      const playerTitle = document.createElement("p");

      playerTitle.innerText = player.name;

      player.hand.forEach((card) => {
        const cardImage = document.createElement("img");
        cardImage.setAttribute("src", `${imgPath}back.png`);
        cardImage.id = card + "-id";
        cardImage.setAttribute("class", `${player.name}`);
        cardImage.setAttribute("width", "100px");
        cardImage.setAttribute("height", "100px");
        playerHandUI.appendChild(cardImage);
      });

      parentHandUI.appendChild(playerTitle);
      parentHandUI.appendChild(playerHandUI);
    }
  });
});

socket.on(JOIN_GAME, ({ message, numPlayers }) => {
  if (!document.getElementById("num-of-players-id")) {
    return;
  }

  if (game_id && game_id !== 0) {
    document.getElementById("num-of-players-id").innerText =
      "Number of Players: " + numPlayers;
  }

  showMessage(message);
});

socket.on(PLAY_CARD, ({ card_id, game_id, user_id, top_discard }) => {
  document.getElementById("discard-img-id").src = imgPath + top_discard;
});

socket.on(DRAW_CARD, ({ card_id, game_id, user_id, discardPile, top_deck }) => {
  document.getElementById("deck-img-id").src = imgPath + top_deck;
});
