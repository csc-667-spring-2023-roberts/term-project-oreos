const getUserSession = async () => {
  try {
    const res = await fetch("/api/users/user-session");
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.log(err);
  }
};

const createGame = async () => {
  const form = document.getElementById("create-game-form-id");
  const formData = new FormData(form);
  const formDataJson = {};

  for (const [key, value] of formData) {
    formDataJson[key] = value;
  }

  const userSession = await getUserSession();
  formDataJson["user_id"] = userSession.user_id;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataJson),
  };

  try {
    const res = await fetch("/api/games/create", options);
    const data = await res.json();

    if (data.status === 400) {
      alert(data.message);
      return;
    }

    let gamesList = document.getElementById("games-list-id");
    let li = document.createElement("li");
    const { gametitle, player_count, game_id } = data;
    li.innerHTML = `Name: <a href="/games/${game_id}">${gametitle}</a>, Players: ${player_count}`;
    gamesList.appendChild(li);
  } catch (err) {
    console.log(err);
  }
};

const getAllGames = () => {
  //TODO Implement
  console.log("list of all games");
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

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataJson),
  };

  try {
    const res = await fetch("/api/games/lobby-chat", options);
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
