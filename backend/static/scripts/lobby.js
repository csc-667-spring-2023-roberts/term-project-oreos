const createGame = async () => {
  const form = document.getElementById("create-game-form-id");
  const formData = new FormData(form);
  const formDataJson = {};

  for (const [key, value] of formData) {
    formDataJson[key] = value;
  }

  try {
    const res = await fetch("/api/users/user-session");
    const data = await res.json();
    console.log(data.user?.user_id);
    formDataJson["user_id"] = data.user?.user_id;
  } catch (err) {
    console.log(err);
  }

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
    console.log(data);

    let gamesList = document.getElementById("games-list-id");
    let li = document.createElement("li");
    const { gametitle, player_count, game_id } = data.message;
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

const sendMessage = () => {
  //TODO Implement
  console.log("message sent in lobby");
};
