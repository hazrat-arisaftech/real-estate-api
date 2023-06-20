const router = require("express").Router();
const Blog = require("../models/Blog");
const verify = require("../middlewares/verify");
const upload = require("../middlewares/fileUpload");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: string
 *       in: cookie
 *       name: accessToken
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - context
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the blog
 *         title:
 *           type: string
 *           description: The title of your blog
 *         context:
 *           type: string
 *           description: The context of your blog
 *         blogImg:
 *           type: string
 *           description: Your blog image
 *         tags:
 *           type: [String]
 *           description: tags for your blog
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the blog was made
 *
 *       example:
 *         id: 645a091da776c221d8336880
 *         title: The title of the blog
 *         context: "Blog contxt"
 *         blogImg: image.png
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog posting
 * paths:
 *  /api/v1/blogpost/{userid}:
 *   post:
 *     summary: Create a blog
 *     tags: [Blogs]
 *     produces:
 *       - application/json
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: userid
 *       - in: cookie
 *         name: accessToken
 *         type: string
 *         required: true
 *       - in: formData
 *         name: title
 *         type: string
 *         required: true
 *       - in: formData
 *         name: context
 *         type: string
 *         required: true
 *       - in: formData
 *         name: file
 *         type: file
 *     security:
 *         cookie-auth: []
 *     responses:
 *       200:
 *         description: The created blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: All blogs
 *   description: See all blogs
 * /api/v1/blogs:
 *   get:
 *     summary: Blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: The created blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: single blog
 *   description: Get a single blog
 * paths:
 *   /api/v1/singlepost/{blogid}:
 *    get:
 *     summary: Single blog
 *     tags: [Blogs]
 *     parameters:
 *      - name: blogid
 *        in: path
 *     responses:
 *       200:
 *         description: The created blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog posting
 * /api/v1/blogpost/:userid:
 *   put:
 *     security:
 *       - cookieAuth: []
 *     summary: Update a blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: The created blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 *
 */

// /**
//  * @swagger
//  * tags:
//  *   name: Delete blog
//  *   description: Delete a blog
//  * paths:
//  *  /api/v1/blogpost/{userid}/{blogid}
//  *  delete:
//  *     summary: delete a Blog
//  *     tags: [Blogs]
//  *     parameters:
//  *      - name: userid
//  *        in: path
//  *      - name: blogid
//  *        in: path
//  *     responses:
//  *       200:
//  *         description: Blog deleted
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Blog'
//  *       500:
//  *         description: Some server error
//  */
// create post
router.post("/blogpost/:userid", verify, upload.single("file"), (req, res) => {
  // console.log(req.body);
  if (req.user.id === req.params.userid) {
    const { title, context, blogImg, tags, socials, comments } = req.body;
    const file = req.file;
    let newBlog;
    if (!file) {
      newBlog = new Blog({
        title,
        context,
        blogImg,
        tags,
        socials,
        comments,
      });
    } else {
      const str = file.path;
      // const path = "../" + str.replace(/\\/g, "/");
      const path = "http://localhost:5000/" + str.replace(/\\/g, "/");
      newBlog = new Blog({
        title,
        context,
        blogImg: path,
        tags,
        socials,
        comments,
      });
    }
    newBlog.save();
    return res.status(200).json(newBlog);
  }
  return res.status(401).json("You are not logged in");
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
