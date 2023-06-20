const router = require("express").Router();
const WishList = require("../models/WishList");
const User = require("../models/Users");
const Property = require("../models/Property");

// router.post("/");
router.put("/wishlist", async (req, res) => {
  const { userId, propertyId } = req.body;
  const user = await User.findById(userId);
  const property = await Property.findById(propertyId);

  if (user && property) {
    if (!user.wishlist.includes(propertyId)) {
      await user.updateOne({ $push: { wishlist: propertyId } });
      res.status(200).json("Added");
    } else {
      await user.updateOne({ $pull: { wishlist: propertyId } });
      res.status(200).json("Removed from your wish list");
    }
  } else {
    res.status(500).json("Something went wrong");
  }
});

module.exports = router;
