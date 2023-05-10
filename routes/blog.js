const router = require("express").Router();
const Blog = require("../models/Blog");
const verify = require("../middlewares/verify");

// create post
router.post("/blogpost/:userid", verify, (req, res) => {
  if (req.user.id === req.params.userid) {
    const { title, context, blogImg, tags, socials, comments } = req.body;
    const newBlog = new Blog({
      title,
      context,
      blogImg,
      tags,
      socials,
      comments,
    });
    newBlog.save();
    return res.status(200).json(newBlog);
  }
  return res.status(401).json("You are not logged in");
});
router.get("/", (req, res) => {
  res.json();
});

// all blogs
router.get("/blogs", async (req, res) => {
  const posts = await Blog.find();
  if (!posts) {
    return res.status(404).json("NO posts yet");
  }
  // return res.status(200).json(posts);
  return res.status(200).json({ posts: posts });
});

// find single post
router.get("/singlepost/:postid", async (req, res) => {
  const singlePost = await Blog.findById(req.params.postid);
  if (!singlePost) {
    return res.status(404).json("No posts found");
  }
  return res.status(200).json(singlePost);
});
// update post
router.put("/blogpost/:userid/:postid", verify, async (req, res) => {
  if (req.params.userid === req.user.id) {
    console.log("Body ", req.body);
    const modifiedPost = await Blog.findByIdAndUpdate(
      req.params.postid,
      { $set: req.body },
      { new: true }
    );

    if (!modifiedPost) {
      res.status(401).json("Blog not found");
    }
    return res.status(200).json({ modifiedPost: modifiedPost });
  }
  return res.status(401).json("You're not logged in ");
});

// delete post
router.delete("/blogpost/:userid/:postid", verify, async (req, res) => {
  if (req.user.id == req.params.userid) {
    await Blog.findByIdAndDelete(req.params.postid);
    return res.status(200).json("post Deleted");
  }
  res.status(401).json("You're not authorized");
});

module.exports = router;
