const { Schema, model } = require("mongoose");

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      // required: true,
    },
    comments: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    propertyImg: {
      type: String,
      //   required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Property = new model("Property", propertySchema);
module.exports = Property;
