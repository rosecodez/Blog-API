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

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

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
      console.log("JWT Payload:", jwtPayload);
      const user = await User.findById(jwtPayload.id);
      if (user) {
        console.log("User found:", user);
        return done(null, user);
      } else {
        console.log("No user found");
        return done(null, false);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      return done(err, false);
    }
  })
);

function generateToken(user) {
  const payload = { id: user.id, username: user.username, author: user.author };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("Generated Token:", token);
  return token;
}

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Passport authentication error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!user) {
      if (info && info.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      console.log("No user found", info);
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    console.log("Authenticated user:", user);
    next();
  })(req, res, next);
};

async function addUsers() {
  const users = [
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

  for (const user of users) {
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
    console.log(`Error creating user: ${err.message}`);
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

    user.username = req.body.username;
    user.author = req.body.author;
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

// Signup user get
const signupUser = asyncHandler((req, res, next) => {
  res.render("signup-form");
});

// Signup user post
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
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  }),
];

// Login user get
const loginUser = asyncHandler((req, res) => {
  res.render("login-form", { user: req.user });
});

// Login user post
const loginUserPost = [
  body("username").trim().isLength({ min: 6 }).escape(),
  body("password").trim().isLength({ min: 10 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login-form", {
        errors: errors.array(),
        user: req.body,
      });
    }

    passport.authenticate(
      "local",
      { session: false },
      async (err, user, info) => {
        if (err || !user) {
          return res.status(400).json({ error: info.message });
        }

        req.login(user, { session: false }, async (err) => {
          if (err) {
            return res.status(500).json({ error: "Login failed" });
          }

          const token = generateToken(user);

          res.render("user-details", {
            user: user,
            token: token,
          });
        });
      }
    )(req, res, next);
  }),
];

// Logout user
const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return next(err);
      }
      // Clear session cookie if necessary
      res.clearCookie("connect.sid");
      // Respond with a success message or status code
      res.json({ message: "Logged out successfully" });
    });
  } catch (err) {
    next(err);
  }
});

const userDetails = (req, res) => {
  console.log("Current user in userDetails controller:", req.user);
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Access denied. No user found." });
  }
};

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
