const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    context: {
      type: String,
      required: true,
    },
    blogImg: {
      type: String,
    },
    tags: {
      type: [String],
      default: [""],
    },
    socials: {
      type: [String],
    },
    comments: {
      type: [String],
    },
  },

  {
    timestamps: true,
  }
);

const Blog = new model("Blog", blogSchema);
module.exports = Blog;
