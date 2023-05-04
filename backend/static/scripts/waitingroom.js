const showMessage = (data) => {
  document.getElementById("msg-id").innerText = data.message;

  setTimeout(() => {
    document.getElementById("msg-id").innerText = "";
  }, 5000);
};

const getGameId = (location) => {
  const gameId = location.substring(location.lastIndexOf("/") + 1);

  if (gameId === "lobby") {
    return 0;
  } else {
    return parseInt(gameId);
  }
};

const isOnGoingGame = () => {
  // get game session to see if it is ongoing
  // if so then redirect joining player to that game
  let isOnGoing = false;

  if (isOnGoing) {
    const game_id = getGameId(document.location.pathname);
    window.location.href = `/games/${game_id}`;
  }
};

const checkPlayerCount = async () => {
  const game_id = getGameId(document.location.pathname);

  try {
    const res = await fetch(`/api/waitingroom/${game_id}`);
    const data = await res.json();

    if (data.status === 400 || data.status === 500) {
      showMessage(data);
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

isOnGoingGame();
