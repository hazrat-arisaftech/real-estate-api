const router = require("express").Router();
const Service = require("../models/Service");

// create post
router.post("/servicepost", (req, res) => {
  const { title, description, serviceImg } = req.body;
  const newBlog = new Service({
    title,
    description,
    serviceImg,
  });
  newBlog.save();
  return res.status(200).json(newBlog);
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
router.put("/servicepost/:userid/:serviceid", async (req, res) => {
  const modifiedService = await Service.findByIdAndUpdate(
    req.params.serviceid,
    { $set: req.body },
    { new: true }
  );
  if (!modifiedService) {
    res.status(401).json("Something went wrong");
  }
  return res.status(200).json({ modifiedPost: modifiedService });
});

// delete post
router.delete("/servicepost/:userid/:serviceid", async (req, res) => {
  await Service.findByIdAndDelete(req.params.serviceid);
  return res.status(200).json("service Deleted");
});

module.exports = router;
