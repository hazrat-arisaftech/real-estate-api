const express = require("express");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();
const port = process.env.PORT;

app.use(express.json());
// app.use();

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
