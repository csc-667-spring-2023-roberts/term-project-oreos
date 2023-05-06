let playerInfo = [];
let opponents = [];
const imgPath = "../images/";

const showMessage = (data) => {
  document.getElementById("msg-id").innerText = data.message;

  setTimeout(() => {
    document.getElementById("msg-id").innerText = "";
  }, 5000);
};

const showUnoCallButton = () => {
  const unoButton = document.createElement("button");
  unoButton.innerHTML = "Call UNO";
  unoButton.onclick = function () {
    callUno();
  };
  unoButton.id = "uno-button-id";
  document.getElementById("call-uno-container-id").appendChild(unoButton);

  setTimeout(() => {
    document.getElementById("uno-button-id").remove();
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
    playerInfo = data.playerInfo;
    opponents = data.opponents;

    if (data.status === 400 || data.status === 500) {
      showMessage(data);
      return;
    }
  } catch (err) {
    console.log(err);
  }

  startGame();
};

const addCardsToPlayerHand = () => {
  const playerHandUI = document.createElement("div");
  playerHandUI.id = "player-hand-id";
  const playerTitle = document.createElement("p");

  playerTitle.innerText = playerInfo.name;

  playerInfo.hand.forEach((card) => {
    const cardImage = document.createElement("img");
    cardImage.id = card + "-id";
    cardImage.setAttribute("src", `${imgPath}${card}`);
    cardImage.setAttribute("class", `${playerInfo.name}`);
    cardImage.setAttribute("width", "100px");
    cardImage.setAttribute("height", "100px");

    cardImage.addEventListener("click", async () => {
      console.log("Card played:" + card);

      await playCard(card);
    });

    playerHandUI.appendChild(cardImage);
  });

  document.getElementById("player-hand-parent-id").appendChild(playerTitle);
  document.getElementById("player-hand-parent-id").appendChild(playerHandUI);
};

const addCardsToOpponentHand = () => {
  opponents.forEach((opponent) => {
    const opponentHandUI = document.createElement("div");
    opponentHandUI.id = "opponent-hand-id";
    const playerTitle = document.createElement("p");

    playerTitle.innerText = opponent.name;

    opponent.hand.forEach((card) => {
      const cardImage = document.createElement("img");
      cardImage.id = card + "-id";
      cardImage.setAttribute("src", `${imgPath}${card}`);
      cardImage.setAttribute("class", `${opponent.name}`);
      cardImage.setAttribute("width", "100px");
      cardImage.setAttribute("height", "100px");
      opponentHandUI.appendChild(cardImage);
    });

    document
      .getElementById("opponents-hand-parent-id")
      .appendChild(playerTitle);
    document
      .getElementById("opponents-hand-parent-id")
      .appendChild(opponentHandUI);
  });
};

const startGame = () => {
  addCardsToPlayerHand(playerInfo);
  addCardsToOpponentHand();
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

const playCard = async (cardName) => {
  const formDataJson = {};

  const game_id = getGameId(document.location.pathname);
  formDataJson["game_id"] = game_id;
  formDataJson["user_id"] = 1;
  formDataJson["card_id"] = cardName;

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataJson),
  };

  try {
    const res = await fetch(`/api/games/${game_id}/play`, options);
    const data = await res.json();
    playerInfo = data.playerInfo;
    console.log(playerInfo.hand.length);

    if (playerInfo.hand.length === 1) {
      showUnoCallButton();
    }

    if (data.status === 400 || data.status === 500) {
      showMessage(data);
      return;
    }
  } catch (err) {
    console.log(err);
  }

  const cardUI = document.getElementById(cardName + "-id");
  cardUI.remove();
};

const drawCard = async () => {
  const formDataJson = {};

  formDataJson["user_id"] = 1;
  const game_id = getGameId(document.location.pathname);
  formDataJson["game_id"] = game_id;

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataJson),
  };

  try {
    const res = await fetch(`/api/games/${game_id}/draw`, options);
    const data = await res.json();

    let playerInfoNewCards = data.playerInfoNewCards;
    playerInfo = data.playerInfo;

    const playerHandUI = document.getElementById("player-hand-id");

    playerInfoNewCards.hand.forEach((card) => {
      const cardImage = document.createElement("img");
      cardImage.id = card + "-id";
      cardImage.setAttribute("src", `${imgPath}${card}`);
      cardImage.setAttribute("class", `${playerInfoNewCards.name}`);
      cardImage.setAttribute("width", "100px");
      cardImage.setAttribute("height", "100px");

      cardImage.addEventListener("click", async () => {
        console.log("Card played:" + card);

        await playCard(card);
      });

      playerHandUI.appendChild(cardImage);

      if (data.status === 400 || data.status === 500) {
        showMessage(data);
        return;
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const callUno = async () => {
  const formDataJson = {};

  const game_id = getGameId(document.location.pathname);
  formDataJson["game_id"] = game_id;

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataJson),
  };

  try {
    const res = await fetch(`/api/games/${game_id}/uno`, options);
    const data = await res.json();

    if (data.status === 400 || data.status === 500) {
      showMessage(data);
      return;
    }
  } catch (err) {
    console.log(err);
  }
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
