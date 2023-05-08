const bcrypt = require("bcrypt");
const { use } = require("../routes/users");

const User = {};
const SALT_ROUNDS = 10;

User.signin = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  try {
    // TODO placeholder info, replace data retrieved from database

    const id = 2;
    //await Users.findByEmail(email);
    const isValidUser = true; //await bcrypt.compare(password, hash);

    if (isValidUser) {
      req.session.user = {
        id,
        username,
        email,
      };

      res.send({ url: "/lobby", status: 200 });
    } else {
      res.send({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log({ error });
    res.send({ message: "Error signing in" });
  }
};

User.register = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username.length === 0 ||
    email.length === 0 ||
    password.length === 0
  ) {
    res.send({ message: "Fields cannot be blank", status: 400 });
    return;
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  try {
    // TODO replace with database data
    const id = 1; //await Users.create(username, email, hash);
    req.session.user = {
      id,
      username,
      email,
    };

    console.log(req.session.user);

    res.send({ url: "/lobby", status: 200 });
  } catch (error) {
    console.log({ error });
    res.send({ message: "Error signing up", status: 400 });
  }
};

User.signout = async (req, res) => {
  try {
    req.session.destroy();
    res.send({ url: "/", status: 200 });
  } catch (err) {
    res.send({ message: "Error logging out", status: 500 });
  }
};

User.getUserSession = async (req, res) => {
  res.send({ user: req.session.user });
};

module.exports = User;
