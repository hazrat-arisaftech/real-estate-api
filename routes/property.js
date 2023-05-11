const router = require("express").Router();
const Property = require("../models/Property");
const verify = require("../middlewares/verify");
const upload = require("../middlewares/fileUpload");
// create post
router.post(
  "/propertypost/:userid",
  upload.single("file"),
  verify,
  (req, res) => {
    if (req.params.userid === req.user.id) {
      const file = req.file;
      const str = file.path;
      const path = "../" + str.replace(/\\/g, "/");
      const {
        title,
        size,
        location,
        rooms,
        baths,
        price,
        description,
        propertyImg,
      } = req.body;
      const newProperty = new Property({
        title,
        size,
        location,
        rooms,
        baths,
        price,
        description,
        propertyImg: path,
      });
      newProperty.save();
      return res.status(200).json(newProperty);
    }
    return res.status(401).json("log in first");
  }
);

// all properties
router.get("/properties", async (req, res) => {
  const properties = await Property.find();
  if (!properties) {
    return res.status(404).json("NO posts yet");
  }
  // return res.status(200).json(posts);
  return res.status(200).json({ properties });
});

// single property
router.get("/singleproperty/:propertyid", async (req, res) => {
  const singleproperty = await Property.findById(req.params.propertyid);
  if (!singleproperty) {
    return res.status(404).json("No services found");
  }
  return res.status(200).json(singleproperty);
});
// update property
router.put("/propertypost/:userid/:propertyid", verify, async (req, res) => {
  if (req.user.id === req.params.userid) {
    const modifiedProperty = await Property.findByIdAndUpdate(
      req.params.propertyid,
      { $set: req.body },
      { new: true }
    );
    if (!modifiedProperty) {
      res.status(401).json("Something went wrong");
    }
    return res.status(200).json({ modifiedPost: modifiedProperty });
  }
  return res.status(401).json("You're not authorized");
});

// delete property
router.delete("/propertypost/:userid/:propertyid", verify, async (req, res) => {
  if (req.user.id === req.params.userid) {
    await Property.findByIdAndDelete(req.params.propertyid);
    return res.status(200).json("property Deleted");
  }
  return res.status(401).json("You're not authorized");
});

// latest properties

router.get("/latestproperties", async (req, res) => {
  const latesPosts = await Property.find().sort({ dataField: -1 }).limit(6);
  if (!latesPosts) {
    return res.status(404).json("something went wrong");
  }
  return res.status(200).json(latesPosts);
});

module.exports = router;
