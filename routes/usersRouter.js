const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET all users
router.get("/", userController.getAllUsers);

// GET a specific user by id
router.get("/:id", userController.getUserById);

// POST create a new user
router.post("/", userController.createUser);

// PUT update a user by id
router.put("/:id", userController.updateUser);

// DELETE a user by id
router.delete("/:id", userController.deleteUser);

module.exports = router;
