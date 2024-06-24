const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

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

// Get a specific user by id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Create a new user
const createUser = async (req, res, next) => {
  const { username, password, author } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      author,
    });

    await user.save();
    res.status(201).json(user);
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

    const { username, password, author } = req.body;

    if (username) {
      user.username = username;
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (author !== undefined) {
      user.author = author;
    }

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

    await user.remove();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addUsers,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
