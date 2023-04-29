console.log("Hello from a bundled  assetsss.");
import io from "socket.io-client";
import { getGameId } from "./get-game-id";
import { CHAT, JOIN_GAME, CREATE_GAME } from "./constants";

const socket = io();
const game_id = getGameId(document.location.pathname);

socket.emit(JOIN_GAME, { game_id });

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

socket.on(JOIN_GAME, ({ message }) => {
  console.log(message);
});
