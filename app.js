//* =======================================
//*              DEPENDENCIES
//* =======================================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

//* =======================================
//*              CONFIGURATIONS
//* =======================================
require("dotenv").config();
const mongodbURI = process.env.MONGODB_URI;

//* =======================================
//*        BODY PARSER, MIDDLEWARE
//* =======================================
app.use(cors());

app.use(
  session({
    secret: process.env.SECRET || "local-dev-only",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static("public"));
app.use(express.static("./client/build"));

//* =======================================
//*            MONGOOSE CONNECTION
//* =======================================
if (mongodbURI) {
  mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
} else {
  console.warn(
    "MONGODB_URI not set — API routes will fail until it is configured",
  );
}

mongoose.connection.on("error", (err) =>
  console.log(err.message + " is Mongod not running?"),
);

mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));

mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

//* =======================================
//*         CONTROLLERS/ROUTES
//* =======================================
const postsController = require("./controllers/posts.js");
app.use("/v1/posts", postsController); //only users can post

const hawkersController = require("./controllers/hawkers");
app.use("/v1/hawkers", hawkersController);

const dishesController = require("./controllers/dishes.js");
app.use("/v1/dishes", dishesController);

const usersController = require("./controllers/users.js");
app.use("/v1/users", usersController);

const sessionController = require("./controllers/sessions");
app.use("/v1/sessions", sessionController);

//* allow for pathing on deployment e.g. Heroku
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build", "index.html"));
});

module.exports = app;
