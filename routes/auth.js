const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - email
 *         - userName
 *         - password
 *       properties:
 *         id:
 *           type: String
 *           description: The auto-generated id of the blog
 *         email:
 *           type: String
 *           description: Email
 *         userName:
 *            type: String
 *            description: username
 *         password:
 *            type: String
 *            description: password of your account
 *         userImg:
 *             type: String
 *             description: "image.png"
 *       example:
 *         id: 6459da0179f931af21b804be
 *         email: "hazratali3711@gmail.com"
 *         userName: "Hazrat Ali"
 *         password: "$2a$10$Gc2C3OMxGa5TR2L5YYqba..fwQZ43iC2r3Gs/55Obx3Ke0eaxM/8y"
 *         userImg: "image.png"
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Prooperty post
 * /api/v1/retgister:
 *   post:
 *     summary: Create an account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: User Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   descriptioin: Login
 * paths:
 *  /api/v1/login
 */

let transporter = nodemailer.createTransport({
  host: process.env.mail_host,
  port: process.env.mail_port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.mail_user, // generated ethereal user
    pass: process.env.mail_pass, // generated ethereal password
  },
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = randomstring.generate({ length: 4, charset: "numeric" });
  try {
    await User.findOneAndUpdate({ email }, { otp }, { upsert: true });
    const mailOptions = {
      from: '"REal Estate OTP" <test@webhawksit.net>',
      to: email,
      subject: "Real Estate OTP",
      text: `Your OTP is ${otp}`,
      html: `<b>Your OTP is ${otp}</b>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json("Failed to send OTP");
      } else {
        res.status(200).json("OTP sent successful");
      }
    });
  } catch (err) {
    res.status(500).json("Failed to store OTP");
  }
});
router.post("/login/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      res.status(400).json("Invalid OTP");
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json("Password changed successfully");
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json("Failed to change password");
  }
});

// Health
router.get("/health", async (req, res) => {
  return res.status(200).json({ server: "running" });
});

router.get("/test", (req, res) => {
  OTP();
  res.json("test");
});
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
  console.log(req.body);
  console.log(typeof req.body);
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    bcrypt.compare(req.body.password, userExist.password, function (err, resp) {
      if (resp) {
        // res.status(200).json("Logged in");
        const token = jwt.sign({ id: userExist._id }, process.env.jwt_secret);
        res
          .cookie("accessToken", token, {
            httpOnly: true,
          })
          .status(200)
          .json("Logged in");
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
