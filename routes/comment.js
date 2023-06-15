const router = require("express").Router();
const Comment = require("../models/Comment");
const Property = require("../models/Property");
const User = require("../models/Users");
const Blog = require("../models/Blog");

router.put("/porpcomment", async (req, res) => {
  const { userId, postId, comment } = req.body;
  const user = await User.findById(userId);
  const property = await Property.findById(postId);

  if (user && property) {
    const newComment = new Comment({
      userId,
      postId,
      comment,
    });
    newComment.save();
    await property.updateOne({ $push: { comments: newComment._id } });
    console.log(newComment._id);
    console.log(newComment);
    res.status(200).json("Comment added");
  } else {
    res.status(500).json("Something went wrong");
  }
});

router.put("/blogcomment", async (req, res) => {
  const { userId, postId, comment } = req.body;
  const user = await User.findById(userId);
  const blog = await Blog.findById(postId);
  if (user && blog) {
    const newComment = new Comment({
      userId,
      postId,
      comment,
    });
    newComment.save();
    await blog.updateOne({ $push: { comments: newComment._id } });
    res.status(200).json("Comment added");
  } else {
    res.status(500).json("Something went wrong");
  }
});
module.exports = router;
