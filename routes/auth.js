const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const { json } = require("express/lib/response");

// Signup
router.post("/register", async (req, res) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (!userExist) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return res.status(401).json("Something went wrong");
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        const newUser = new User({
          email: req.body.email,
          userName: req.body.userName,
          password: hash,
        });
        newUser.save();
        res.status(200).json(newUser);
      });
    });
  } else {
    res.status(200).json("User already Exits. Log in");
  }
});

// Sing in
router.post("/login", async (req, res) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    bcrypt.compare(req.body.password, userExist.password, function (err, resp) {
      if (resp) {
        res.status(200).json("Logged in");
      } else {
        res.status(401).json("Wrong credentials");
      }
    });
  } else {
    return res.status(404).json("User doesn't exist");
  }
});

router.get("/register", (req, res) => {
  res.json("Hello world");
});

module.exports = router;
