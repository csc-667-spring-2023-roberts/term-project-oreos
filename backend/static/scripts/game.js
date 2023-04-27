const getUserSession = async () => {
  try {
    const res = await fetch("/api/users/user-session");
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.log(err);
  }
};

const getGameSession = async () => {
  try {
    const res = await fetch("/api/games/game-session");
    const data = await res.json();
    return data.game;
  } catch (err) {
    console.log(err);
  }
};

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
  const gameSession = await getGameSession();
  const game_id = gameSession.game_id;

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

    let chatList = document.getElementById("chat-list-id");
    let li = document.createElement("li");
    const { message, username } = data;
    li.innerHTML = `${username}: ${message}`;
    chatList.appendChild(li);
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
