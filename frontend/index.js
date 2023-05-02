console.log("Hello from a bundled  assetsss.");
import io from "socket.io-client";
import { getGameId } from "./get-game-id";
import { CHAT, JOIN_GAME, CREATE_GAME, START_GAME } from "./constants";

const socket = io();
const game_id = getGameId(document.location.pathname);
// TODO get user from session
const user = {
  name: "Jon",
  user_id: 1,
};

socket.emit(JOIN_GAME, { game_id, user });

socket.on(CREATE_GAME, ({ gametitle, count, user_id, game_id }) => {
  let gamesList = document.getElementById("games-list-id");
  let li = document.createElement("li");
  li.innerHTML = `Name: <a href="/games/${game_id}">${gametitle}</a>, Players: ${count}`;
  gamesList.appendChild(li);
});

socket.on(CHAT, ({ message, username }) => {
  let chatList = document.getElementById("chat-list-id");
  let li = document.createElement("li");
  li.innerHTML = `${username}: ${message}`;
  chatList.appendChild(li);
});

socket.on(START_GAME, ({ deck, discardPile }) => {
  const imgPath = "../images/";
  document.getElementById("deck-img-id").src = imgPath + deck[0];
  document.getElementById("discard-img-id").src = imgPath + discardPile[0];
});

socket.on(JOIN_GAME, ({ message, numPlayers }) => {
  console.log(message);

  if (game_id && game_id !== 0) {
    document.getElementById("num-of-players-id").innerText =
      "Number of Players: " + numPlayers;
  }
});
