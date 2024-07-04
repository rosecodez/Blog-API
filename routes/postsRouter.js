const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// GET all posts
router.get("/", postController.getAllPosts);

// GET a specific post by id
router.get("/:postId", postController.getPostById);

// POST create a new post
router.get("/createPost", postController.createPostGet);
router.post("/createPost", postController.createPostPost);

// PUT update a post by id
router.put("/:postId", postController.updatePost);

// DELETE a post by id
router.delete("/delete/:postId", postController.deletePost);

module.exports = router;
