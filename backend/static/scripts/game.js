let playerInfo = [];
let players = [];
const imgPath = "../images/";

const showMessage = (data) => {
  if (!document.getElementById("msg-id")) {
    return;
  }

  document.getElementById("msg-id").innerText = data.message;

  setTimeout(() => {
    document.getElementById("msg-id").innerText = "";
  }, 10000);
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
  }, 10000);
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
    players = data.players;

    if (data.status === 400 || data.status === 500) {
      showMessage(data);
      return;
    }

    startGame();
  } catch (err) {
    console.log(err);
  }
};

const addCardsToPlayerHand = () => {
  const parentHandUI = document.getElementById("player-hand-parent-id");
  let playerHandUI = document.createElement("div");
  playerHandUI.id = "player-hand-id";
  const playerTitle = document.createElement("p");
  playerTitle.innerText = `Player: ${playerInfo.name}`;
  playerTitle.className = "player-name";

  playerInfo.hand.forEach((card) => {
    const cardImage = document.createElement("img");
    cardImage.id = card + "-id";
    cardImage.setAttribute("src", `${imgPath}${card}`);
    cardImage.setAttribute("class", "playercard");
    cardImage.setAttribute("width", "100px");
    cardImage.setAttribute("height", "135px");

    cardImage.addEventListener("click", async () => {
      await playCard(card);
    });

    playerHandUI.appendChild(cardImage);
  });

  parentHandUI.innerHTML = "";
  parentHandUI.appendChild(playerTitle);
  parentHandUI.appendChild(playerHandUI);
};

const startGame = () => {
  addCardsToPlayerHand(playerInfo);
};

const sendMessage = async () => {
  const form = document.getElementById("send-chat-form-id");
  const formData = new FormData(form);
  const formDataJson = {};

  for (const [key, value] of formData) {
    formDataJson[key] = value;
  }

  const userSession = await getUserSession();
  formDataJson["user_id"] = userSession.id;
  formDataJson["username"] = userSession.username;
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

const getAllMessages = async () => {
  try {
    const game_id = getGameId(document.location.pathname);
    const res = await fetch(`/api/games/${game_id}/chat`, { method: "GET" });
    const data = await res.json();
    const messageArray = data.messageArray;

    if (data.status === 400 || data.status === 500) {
      return;
    }

    let chatList = document.getElementById("chat-list-id");

    if (!chatList) {
      return;
    }

    chatList.innerHTML = "";

    messageArray.map((msg) => {
      let li = document.createElement("div");
      li.className = "message";
      const date = new Date(msg.created_at);

      const createdAtFormatted = date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      });

      li.innerHTML = `${msg.username} ${createdAtFormatted}: ${msg.message}`;
      chatList.appendChild(li);
    });
  } catch (err) {
    console.log(err);
  }
};


// PLAY CARD
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

//end of PLAY CARD

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
      cardImage.setAttribute("height", "135px");

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

const saveGameState = async () => {
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
    const res = await fetch(`/api/games/${game_id}/state`, options);
    const data = await res.json();
    window.location.href = "/lobby";

    if (data.status === 400 || data.status === 500) {
      showMessage(data);
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

const endGame = () => {
  //TODO implement
  console.log("game ended");
};

const delayInitCards = () => {
  const delay = Math.random() * 1100 + 700;
  setTimeout(async () => {
    await initCards();
  }, delay);
};

delayInitCards();
getAllMessages();
