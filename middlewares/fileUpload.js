const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("inside middleware: ", req.path);
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
    // next();
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
