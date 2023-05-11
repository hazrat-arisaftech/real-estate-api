const router = require("express").Router();
const Service = require("../models/Service");
const verify = require("../middlewares/verify");
const upload = require("../middlewares/fileUpload");

// create post
router.post("/servicepost/:userid", upload.single("file"), (req, res) => {
  if (req.params.userid === req.user.id) {
    const { title, description, serviceImg } = req.body;

    const str = file.path;
    const path = "../" + str.replace(/\\/g, "/");
    const newBlog = new Service({
      title,
      description,
      serviceImg: path,
    });
    newBlog.save();
    return res.status(200).json(newBlog);
  }
  return res.status(401).json("you're not authorized");
});

// all services
router.get("/services", async (req, res) => {
  const services = await Service.find();
  if (!services) {
    return res.status(404).json("NO posts yet");
  }
  // return res.status(200).json(posts);
  return res.status(200).json({ services });
});

// find single service
router.get("/singleservice/:serviceid", async (req, res) => {
  const singleService = await Service.findById(req.params.serviceid);
  if (!singleService) {
    return res.status(404).json("No services found");
  }
  return res.status(200).json(singleService);
});
// update post
router.put("/servicepost/:userid/:serviceid", verify, async (req, res) => {
  if (req.params.userid === req.user.id) {
    const modifiedService = await Service.findByIdAndUpdate(
      req.params.serviceid,
      { $set: req.body },
      { new: true }
    );
    if (!modifiedService) {
      res.status(401).json("Something went wrong");
    }
    return res.status(200).json({ modifiedPost: modifiedService });
  }
  return res.status(401).json("You're not authorized");
});

// delete post
router.delete("/servicepost/:userid/:serviceid", verify, async (req, res) => {
  if (req.params.userid === req.user.id) {
    await Service.findByIdAndDelete(req.params.serviceid);
    return res.status(200).json("service Deleted");
  }
  return res.status(401).json("You're not authorized");
});

module.exports = router;
