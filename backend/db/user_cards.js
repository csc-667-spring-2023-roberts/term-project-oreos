const db = require("./connection.js");

const drawCard = async (game_id, user_id, card_id) => {
  return await db.one(
    "INSERT INTO user_cards (game_id, user_id, card_id) VALUES ($1, $2, $3) RETURNING *",
    [game_id, user_id, card_id]
  );
};

const get = async (game_id, user_id) => {
  return await db.many(
    "SELECT card_id FROM user_cards WHERE game_id = $1 AND user_id = $2",
    [game_id, user_id]
  );
};

const playCard = async (game_id, user_id, card_id) => {
  return await db.one(
    "DELETE FROM user_cards WHERE game_id = $1 AND user_id = $2 AND card_id = $3",
    [game_id, user_id, card_id]
  );
};

const findCardID = async (card_color, card_number) => {
  const result = await db.any(
    "SELECT card_id FROM cards WHERE card_color = $1 AND card_number = $2",
    [card_color, card_number]
  );

  return parseInt(result[0].card_id);
};


module.exports = {
  drawCard,
  get,
  playCard,
  findCardID,
};

