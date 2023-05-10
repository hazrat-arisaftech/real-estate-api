const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
require("dotenv").config();
const port = process.env.PORT;
const authRoute = require("./routes/auth");
const blogRoute = require("./routes/blog");
const serviceRoute = require("./routes/service");
const propertyRoute = require("./routes/property");
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", serviceRoute);
app.use("/api/v1", propertyRoute);

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
