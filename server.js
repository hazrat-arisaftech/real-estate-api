const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const swaggerJsodc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const authRoute = require("./routes/auth");
const blogRoute = require("./routes/blog");
const serviceRoute = require("./routes/service");
const propertyRoute = require("./routes/property");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    withCredentials: true,
    credentials: true,
    allowedHeaders: "X-Requested-With, Content-Type, Authorization",
    methods: "GET, POST, PATCH, PUT, POST, DELETE, OPTIONS",
  })
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Real Estate API",
      version: "0.1.0",
      description: "Real Estate API",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsodc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
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

module.exports = app;
