const getUserSession = async () => {
  try {
    const res = await fetch("/api/users/user-session");
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.log(err);
  }
};

function getGameId(location) {
  const gameId = location.substring(location.lastIndexOf("/") + 1);

  if (gameId === "lobby") {
    return 0;
  } else {
    return parseInt(gameId);
  }
}

const startGame = () => {
  //TODO implement
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

    if (data.status === 400) {
      alert(data.message);
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
