const db = require("./connection.js");

const create = async (
  game_title,
  ongoing,
  top_deck,
  top_discard,
  position,
  users_required
) => {
  return await db.one(
    "INSERT INTO games (game_title, ongoing, top_deck, top_discard, position, users_required) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    [game_title, ongoing, top_deck, top_discard, position, users_required]
  );
};

const getAll = async () => {
  return await db.many("SELECT * FROM games");
};

module.exports = {
  create,
  getAll,
};
