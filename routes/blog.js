const router = require("express").Router();
const Blog = require("../models/Blog");

// create post
router.post("/blogpost", (req, res) => {
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
});
router.get("/", (req, res) => {
  res.json();
});

// delte post
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
router.put("/blogpost/:userid/:postid", async (req, res) => {
  const modifiedPost = await Blog.findByIdAndUpdate(
    req.params.postid,
    { $set: req.body },
    { new: true }
  );
  if (!modifiedPost) {
    res.status(401).json("Something went wrong");
  }
  return res.status(200).json({ modifiedPost: modifiedPost });
});

// delete post
router.delete("/blogpost/:userid/:postid", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.postid);
  return res.status(200).json("post Delted");
});

module.exports = router;
