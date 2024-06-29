const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const { addUsers } = require("./controllers/userController");
const { addComments } = require("./controllers/commentController");
const { addPosts } = require("./controllers/postController");
const User = require("./models/user");

require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");
const commentsRouter = require("./routes/commentsRouter");

const app = express();

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;
mongoose
  .connect(mongoDB)
  .then(async () => {
    console.log("Connected to MongoDB");
    await addUsers();
    await addComments();
    await addPosts();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/posts", commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
