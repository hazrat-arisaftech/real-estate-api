const router = require("express").Router();
const Service = require("../models/Service");
const verify = require("../middlewares/verify");
const upload = require("../middlewares/fileUpload");

/**
 * @swagger
 * components:
 *   securityScheme:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: verify
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: String
 *           description: The auto-generated id of the blog
 *         title:
 *           type: String
 *           description: The title of your property
 *         description:
 *            type: String
 *            description: Description of your service
 *         serviceImg:
 *            type: String
 *            description: Images of your property
 *       example:
 *         id: 645a02e5856b522baf4b0042
 *         title: "First service post"
 *         description: "Service descriptioin"
 *         serviceImg: "image.png"
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Property
 *   description: update a service
 * /api/v1/service/645b7c7de8e113dae5fa1137/645a02e5856b522baf4b0042:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Update a property
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Update a service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Services'
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: All services
 *   description: properties
 * /api/v1/services:
 *   get:
 *     summary: services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: All services
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Services'
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: single service
 *   description: Get a single service
 * paths:
 *   /api/v1/singleservice/{serviceid}:
 *    get:
 *     summary: Single service
 *     tags: [Services]
 *     parameters:
 *      - name: serviceid
 *        in: path
 *     responses:
 *       200:
 *         description: The created service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * tags:
 *   name: Delete
 *   description: Delete a property
 * /api/v1/blogpost/645a091da776c221d8336880/645a02e5856b522baf4b0042:
 *   delete:
 *     summary: delete a service
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Service deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       500:
 *         description: Some server error
 *
 */

// create post
router.post(
  "/servicepost/:userid",
  verify,
  upload.single("file"),
  (req, res) => {
    if (req.params.userid === req.user.id) {
      const { title, description, serviceImg } = req.body;
      const file = req.file;
      let newService;
      if (!file) {
        newService = new Service({
          title,
          description,
          serviceImg,
        });
      } else {
        const str = file.path;
        // const path = "../" + str.replace(/\\/g, "/");
        const path = "http://localhost:5000/" + str.replace(/\\/g, "/");
        newService = new Service({
          title,
          description,
          serviceImg: path,
        });
      }
      newService.save();
      return res.status(200).json(newService);
    }
    return res.status(401).json("you're not authorized");
  }
);

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
