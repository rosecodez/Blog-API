const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

require("dotenv").config();

// Passport configuration
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

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

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

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    author: user.author,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}
const authMiddleware = passport.authenticate("jwt", { session: false });

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
const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Create a new user
const createUser = asyncHandler(async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      author: false,
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    next(err);
  }
});

// Update a user by id
const updateUser = asyncHandler(async (req, res, next) => {
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
});

// Delete a user by id
const deleteUser = asyncHandler(async (req, res, next) => {
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
});

const signupUser = asyncHandler(async (req, res, next) => {
  res.render("signup-form");
});

const signupUserPost = [
  body("username", "Username must be specified and at least 6 characters long")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body("password", "Password must be specified and at least 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup-form", {
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
  res.render("login-form", { user: req.user });
});

const loginUserPost = [
  passport.authenticate("local", {
    failureRedirect: "/users/login",
  }),
  asyncHandler(async (req, res, next) => {
    try {
      const token = generateToken(req.user);
      res.json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }),
];

const logoutUser = asyncHandler(async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

const userDetails = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const token = generateToken(req.user);
    res.render("user-details", { user: req.user, token });
  } else {
    res.redirect("/users/login");
  }
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
  userDetails,
  authMiddleware,
};
