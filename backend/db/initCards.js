const db = require("./connection.js");

const cards = [
  // template: { card_color: ?, card_number: ? }, 
  // card_color: 0 = red, 1 = yellow, 2 = green, 3 = blue, 4 = wild
  // card_number: 0-9, 10 = skip, 11 = reverse, 12 = draw 2, 13 = wild, 14 = wild draw 4
  //RED CARDS
  { card_color: 0, card_number: 0 },
  { card_color: 0, card_number: 1 },
  { card_color: 0, card_number: 2 },
  { card_color: 0, card_number: 3 },
  { card_color: 0, card_number: 4 },
  { card_color: 0, card_number: 5 },
  { card_color: 0, card_number: 6 },
  { card_color: 0, card_number: 7 },
  { card_color: 0, card_number: 8 },
  { card_color: 0, card_number: 9 },
  { card_color: 0, card_number: 10 },
  { card_color: 0, card_number: 11 },
  { card_color: 0, card_number: 12 },
  //YELLOW CARDS
  { card_color: 1, card_number: 0 },
  { card_color: 1, card_number: 1 },
  { card_color: 1, card_number: 2 },
  { card_color: 1, card_number: 3 },
  { card_color: 1, card_number: 4 },
  { card_color: 1, card_number: 5 },
  { card_color: 1, card_number: 6 },
  { card_color: 1, card_number: 7 },
  { card_color: 1, card_number: 8 },
  { card_color: 1, card_number: 9 },
  { card_color: 1, card_number: 10 },
  { card_color: 1, card_number: 11 },
  { card_color: 1, card_number: 12 },
  //GREEN CARDS
  { card_color: 2, card_number: 0 },
  { card_color: 2, card_number: 1 },
  { card_color: 2, card_number: 2 },
  { card_color: 2, card_number: 3 },
  { card_color: 2, card_number: 4 },
  { card_color: 2, card_number: 5 },
  { card_color: 2, card_number: 6 },
  { card_color: 2, card_number: 7 },
  { card_color: 2, card_number: 8 },
  { card_color: 2, card_number: 9 },
  { card_color: 2, card_number: 10 },
  { card_color: 2, card_number: 11 },
  { card_color: 2, card_number: 12 },
  //BLUE CARDS
  { card_color: 3, card_number: 0 },
  { card_color: 3, card_number: 1 },
  { card_color: 3, card_number: 2 },
  { card_color: 3, card_number: 3 },
  { card_color: 3, card_number: 4 },
  { card_color: 3, card_number: 5 },
  { card_color: 3, card_number: 6 },
  { card_color: 3, card_number: 7 },
  { card_color: 3, card_number: 8 },
  { card_color: 3, card_number: 9 },
  { card_color: 3, card_number: 10 },
  { card_color: 3, card_number: 11 },
  { card_color: 3, card_number: 12 },
  //WILD CARDS
  { card_color: 4, card_number: 13 },
  { card_color: 4, card_number: 14 },
];

cards.forEach((card) => {
  const { card_color, card_number } = card;
  const query = {
    text: 'INSERT INTO cards (card_color, card_number) VALUES ($1, $2)',
    values: [card_color, card_number]
  };
  db.query(query)
    .then(() => console.log(`Inserted card ${card_color}-${card_number} into the cards table`))
    .catch(err => console.error(err.stack));
});

  