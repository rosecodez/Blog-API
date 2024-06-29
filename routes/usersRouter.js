const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET all users
router.get("/", userController.getAllUsers);

// GET a specific user by id
router.get("/:userId", userController.getUserById);

// POST create a new user
router.post("/createUser", userController.createUser);

// PUT update a user by id
router.put("/:userId", userController.updateUser);

// DELETE a user by id
router.delete("/:userId", userController.deleteUser);

// signup, login
router.get("/signup", userController.signupUser);
router.post("/signup", userController.signupUserPost);

router.get("/login", userController.loginUser);
router.post("/login", userController.loginUserPost);

router.post("/logout", userController.logoutUser);
module.exports = express.Router;
