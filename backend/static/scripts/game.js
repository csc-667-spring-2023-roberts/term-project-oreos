let playerInfo = [];
let players = [];
const imgPath = "../images/";

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
      let li = document.createElement("li");
      li.innerHTML = `${msg.username}: ${msg.message} ${msg.created_at}`;
      chatList.appendChild(li);
    });
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

const callUno = () => {
  //TODO implement
  console.log("called uno");
};

const endGame = () => {
  //TODO implement
  console.log("game ended");
};

setTimeout(async () => {
  await initCards();
}, 1000);

getAllMessages();
