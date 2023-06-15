const { Schema, model } = require("mongoose");

const wishlistSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    propertyId: {
      type: Array,
      default: [],
    },
  },
  { timeStamps: true }
);

const WishList = new model("WishList", wishlistSchema);
module.exports = WishList;
