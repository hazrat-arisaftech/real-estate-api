const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
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

const Comment = new model("Comment", commentSchema);
module.exports = Comment;
