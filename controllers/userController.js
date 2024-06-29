const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

async function addUsers() {
  let users = [
    {
      username: "author",
      password: await bcrypt.hash("password", 10),
      author: true,
    },
    {
      username: "malusdarkblade",
      password: await bcrypt.hash("password", 10),
      author: false,
    },
  ];

  for (let user of users) {
    try {
      const existingUser = await User.findOne({ username: user.username });
      if (!existingUser) {
        const newUser = new User(user);
        await newUser.save();
        console.log(`User ${newUser.username} added`);
      }
    } catch (err) {
      console.error(`Error adding user ${user.username}:`, err);
    }
  }
}

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Create a new user
const createUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash("securepassword123", 10);

    const newUser = new User({
      username: "tyrionlannister",
      password: hashedPassword,
      author: false,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

// Update a user by id
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = "tyrion";
    user.author = false;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Delete a user by id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const signupUser = asyncHandler(async (req, res, next) => {
  res.render("signup-form");
});

const signupUserPost = [
  body("username", "Username must be specified and at least 6 characters long")
    .trim()
    .isLength({ min: 9 })
    .escape(),
  body("password", "Password must be specified and at least 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        errors: errors.array(),
        user: req.body,
      });
    }
    try {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).render("signup-form", {
          errors: [{ msg: "Username already taken" }],
          user: req.body,
        });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });

      await user.save();
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }),
];

const loginUser = asyncHandler(async (req, res) => {
  res.render("login-form");
});

const loginUserPost = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  }),
];

const logoutUser = asyncHandler(async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = {
  addUsers,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  signupUser,
  signupUserPost,
  loginUser,
  loginUserPost,
  logoutUser,
};
