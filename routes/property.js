const router = require("express").Router();
const Property = require("../models/Property");
const verify = require("../middlewares/verify");
const upload = require("../middlewares/fileUpload");

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       required:
 *         - title
 *         - size
 *         - location
 *         - rooms
 *         - baths
 *         - price
 *         - description
 *       properties:
 *         id:
 *           type: String
 *           description: The auto-generated id of the blog
 *         title:
 *           type: String
 *           description: The title of your property
 *         size:
 *           type: String
 *           description: Size of your property
 *         location:
 *           type: String
 *           description: Location of your property
 *         rooms:
 *           type: Number
 *           description: Number of rooms
 *         baths:
 *           type: Number
 *           description: Number of baths
 *         price:
 *           type: Number
 *           description: Price of your property
 *         description:
 *            type: String
 *            description: Description of your property
 *         propertyImg:
 *            type: String
 *            description: Images of your property
 *       example:
 *         id: 645a107e8e07d3016478269c
 *         title: "Property 1"
 *         size: "100"
 *         rooms: 5
 *         baths: 3
 *         price: 2000000
 *         description: "This is description"
 *         property: "image.png"
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: property posting
 * paths:
 *  /api/v1/propertypost/{userid}:
 *   post:
 *     summary: Create a property
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     parameters:
 *      - name: userid
 *        in: path
 *     responses:
 *       200:
 *         description: The created blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       500:
 *         description: Some server error
 *
 */
/**
 * @swagger
 * tags:
 *   name: Property
 *   description: update a property
 * /api/v1/propertypost/:645b7c7de8e113dae5fa1137/645a107e8e07d3016478269c:
 *   post:
 *     security:
 *       - cookieAuth: []
 *       - jwtAuth: []
 *     summary: Update a property
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: The created blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: All properties
 *   description: properties
 * /api/v1/properties:
 *   get:
 *     summary: properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: The created blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prooperty'
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: single property
 *   description: Get a single property
 * paths:
 *   /api/v1/singleproperty/{propertyid}:
 *    get:
 *     summary: Single property
 *     tags: [Properties]
 *     parameters:
 *      - name: propertyid
 *        in: path
 *     responses:
 *       200:
 *         description: The created blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       500:
 *         description: Some server error
 */
/**
 * @swagger
 * tags:
 *   name: Delete
 *   description: Delete a property
 * /api/v1/blogpost/645a091da776c221d8336880/645a14deac9b6695de82526a:
 *   delete:
 *     summary: delete a property
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Property deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       500:
 *         description: Some server error
 *
 */

// create post
router.post(
  "/propertypost/:userid",
  verify,
  upload.single("file"),
  (req, res) => {
    if (req.params.userid === req.user.id) {
      const file = req.file;
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

      let newProperty;

      if (!file) {
        newProperty = new Property({
          title,
          size,
          location,
          rooms,
          baths,
          price,
          description,
          propertyImg,
        });
      } else {
        const str = file.path;
        // const path = "../" + str.replace(/\\/g, "/");
        const path = "http://localhost:5000/" + str.replace(/\\/g, "/");

        // const path = str.replace(/\\/g, "/");
        newProperty = new Property({
          title,
          size,
          location,
          rooms,
          baths,
          price,
          description,
          propertyImg: path,
        });
      }
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
  const latesPosts = await Property.find().sort({ createdAt: -1 }).limit(6);
  if (!latesPosts) {
    return res.status(404).json("something went wrong");
  }
  return res.status(200).json(latesPosts);
});

module.exports = router;
