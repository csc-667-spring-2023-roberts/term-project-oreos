const bcrypt = require("bcrypt");

const User = {};
const SALT_ROUNDS = 10;

User.signin = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // TODO placeholder info, replace data retrieved from database
    const {
      id,
      username,
      password: hash,
    } = { id: 1, username: "TestUser", password: "hashedpassword" }; //await Users.findByEmail(email);
    const isValidUser = true; //await bcrypt.compare(password, hash);

    if (isValidUser) {
      req.session.user = {
        id,
        username,
        email,
      };

      console.log(req.session);
      res.redirect("/lobby");
    } else {
      res.send({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log({ error });
    res.send({ message: "Error signing in" });
  }
};

User.signup = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

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

    console.log("signed up");
    console.log(req.session.user);

    res.redirect("/lobby");
  } catch (error) {
    console.log({ error });
    res.render("register", {
      title: "Jrob's Term Project",
      username,
      email,
      err_msg: "Error signing up",
    });
  }
};

User.signout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    res.send({ message: "Error logging out" });
  }
};

module.exports = User;
