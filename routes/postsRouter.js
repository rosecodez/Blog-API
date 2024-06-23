const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// GET all posts
router.get("/", postController.getAllPosts);

// GET a specific post by id
router.get("/:id", postController.getPostById);

// POST create a new post
router.post("/", postController.createPost);

// PUT update a post by id
router.put("/:id", postController.updatePost);

// DELETE a post by id
router.delete("/:id", postController.deletePost);

module.exports = router;
