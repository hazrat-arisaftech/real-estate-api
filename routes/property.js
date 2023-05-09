const router = require("express").Router();
const Property = require("../models/Property");

// create post
router.post("/propertypost", (req, res) => {
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
    propertyImg,
  });
  newProperty.save();
  return res.status(200).json(newProperty);
});

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
router.put("/propertypost/:userid/:propertyid", async (req, res) => {
  const modifiedProperty = await Property.findByIdAndUpdate(
    req.params.propertyid,
    { $set: req.body },
    { new: true }
  );
  if (!modifiedProperty) {
    res.status(401).json("Something went wrong");
  }
  return res.status(200).json({ modifiedPost: modifiedProperty });
});

// delete property
router.delete("/propertypost/:userid/:propertyid", async (req, res) => {
  await Property.findByIdAndDelete(req.params.propertyid);
  return res.status(200).json("property Deleted");
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
