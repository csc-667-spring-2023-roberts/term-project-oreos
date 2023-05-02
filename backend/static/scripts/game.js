let cards = [];
let deck = [];
let discardPile = [];
let players = [];

const showMessage = (data) => {
  document.getElementById("msg-id").innerText = data.message;

  setTimeout(() => {
    document.getElementById("msg-id").innerText = "";
  }, 5000);
};

const getUserSession = async () => {
  try {
    const res = await fetch("/api/users/user-session");
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.log(err);
  }
};

const getGameId = (location) => {
  const gameId = location.substring(location.lastIndexOf("/") + 1);

  if (gameId === "lobby") {
    return 0;
  } else {
    return parseInt(gameId);
  }
};

const initCards = async () => {
  const formDataJson = {};

  const game_id = getGameId(document.location.pathname);
  formDataJson["game_id"] = game_id;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataJson),
  };

  try {
    const res = await fetch(`/api/games/${game_id}/start`, options);
    const data = await res.json();
    players = data.players;

    if (data.status === 400 || data.status === 500) {
      showMessage(data);
      return;
    }
  } catch (err) {
    console.log(err);
  }

  startGame();
};

const startGame = () => {
  const imgPath = "../images/";

  players.forEach((player) => {
    const playerDiv = document.createElement("div");
    const playerTitle = document.createElement("p");

    // get player id from session
    if (player.user_id === 1) {
      playerTitle.innerText = player.name;

      player.hand.forEach((card) => {
        const cardImage = document.createElement("img");
        cardImage.setAttribute("src", `${imgPath}${card}`);
        cardImage.setAttribute("class", `${player.name}`);
        cardImage.setAttribute("width", "100px");
        cardImage.setAttribute("height", "100px");
        playerDiv.appendChild(cardImage);
      });
    }

    document.getElementById("player-hand-id").appendChild(playerTitle);
    document.getElementById("player-hand-id").appendChild(playerDiv);
  });

  console.log("init and started game");
};

const sendMessage = async () => {
  const form = document.getElementById("send-chat-form-id");
  const formData = new FormData(form);
  const formDataJson = {};

  for (const [key, value] of formData) {
    formDataJson[key] = value;
  }

  const userSession = await getUserSession();
  formDataJson["user_id"] = userSession.user_id;
  formDataJson["username"] = userSession.name;
  const game_id = getGameId(document.location.pathname);
  formDataJson["game_id"] = game_id;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataJson),
  };

  try {
    const res = await fetch(`/api/games/${game_id}/chat`, options);
    const data = await res.json();

    if (data.status === 400 || data.status === 500) {
      showMessage(data);
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

const playCard = () => {
  //TODO implement
  console.log("card played");
};

const drawCard = () => {
  //TODO implement
  console.log("card drawn");
};

const callUno = () => {
  //TODO implement
  console.log("called uno");
};

const saveGameState = () => {
  //TODO implement
  console.log("game state saved");
};

const getGameState = () => {
  //TODO implement
  console.log("get game state");
};

const endGame = () => {
  //TODO implement
  console.log("game ended");
};

setTimeout(async () => {
  await initCards();
}, 1000);
