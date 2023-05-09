const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userImg: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = new model("User", userSchema);
module.exports = User;
