const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    serviceImg: {
      type: String,
      //   required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = new model("Service", serviceSchema);
module.exports = Service;
