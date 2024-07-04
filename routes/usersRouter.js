const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../controllers/userController");

// GET all users
router.get("/", userController.getAllUsers);

// POST create a new user
router.post("/createUser", userController.createUser);

// PUT update a user by id
router.put("/:userId", userController.updateUser);

// DELETE a user by id
router.delete("/:userId", userController.deleteUser);

// signup
router.get("/signup", userController.signupUser);
router.post("/signup", userController.signupUserPost);

// login
router.get("/login", userController.loginUser);
router.post("/login", userController.loginUserPost);

// display user details (protected route)
router.get("/user-details", userController.userDetails);

// logout
router.get("/logout", userController.logoutUser);

module.exports = router;
