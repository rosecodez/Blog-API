const User = require("../models/user");

let users = [
  {
    id: 1,
    username: "author",
    author: true,
  },
  {
    id: 2,
    username: "malusdarkblade",
    author: false,
  },
];

// Get all users
const getAllUsers = (req, res) => {
  res.json(users);
};

// Get a specific user by id
const getUserById = (req, res) => {
  const userId = 2;

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

// Create a new user
const createUser = (req, res) => {
  const { title, timestamp, published, userId } = req.body;
  const newUser = {
    id: users.length + 1,
    title,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    published: published !== undefined ? published : true,
    user: userId,
  };
  users.push(newUser);
  res.status(201).json(newUser);
};

// Update a user by id
const updateUser = (req, res) => {
  const userId = parseInt(req.params.userId);
  const { username } = req.body;

  const index = users.findIndex((user) => user.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index].username = username;

  res.json(users[index]);
};

// Delete a user by id
const deleteUser = (req, res) => {
  const userId = parseInt(req.params.userId);
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    return res.status(404).json({ message: "user not found" });
  }
  users.splice(index, 1);
  res.sendStatus(204);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
