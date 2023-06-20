const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = new model("Comment", commentSchema);
module.exports = Comment;
