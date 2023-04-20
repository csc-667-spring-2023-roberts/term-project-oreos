const User = {};

User.signin = async (req, res) => {
  // TODO implement
  res.send({ message: "user signed in" });
};

User.signup = async (req, res) => {
  // TODO implement
  res.send({ message: "user signed up" });
};

module.exports = User;
