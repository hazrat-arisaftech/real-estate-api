const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("inside middleware: ", req.path);
    // const arr = req.path.split("/")[0];
    // console.log("arr ", arr);
    // const endpointPath = req.path.split("/").filter(Boolean);
    // console.log(endpointPath[0]);
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
