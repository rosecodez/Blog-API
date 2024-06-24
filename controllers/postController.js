const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");

const addPosts = async () => {
  try {
    let posts = [
      {
        id: 1,
        title: "How I built my first website",
        text: "It was a great experience......",
        timestamp: new Date(),
        published: true,
        userId: "6679b6dd5b9e70e350d8a210",
      },
      {
        id: 2,
        title: "How I started coding",
        text: "I found about The Odin Project......",
        timestamp: new Date(),
        published: true,
        userId: "6679b6dd5b9e70e350d8a210",
      },
    ];

    for (let post of posts) {
      const existingPost = await Post.findOne({ title: post.title });
      if (!existingPost) {
        const user = await User.findById(post.userId);
        if (!user) {
          console.error(`User not found for post: ${post.title}`);
        }
        const newPost = new Post({
          title: post.title,
          text: post.text,
          timestamp: post.timestamp,
          published: post.published,
          user: user._id,
        });

        await newPost.save();
        console.log(`Post "${newPost.title}" added`);
      }
    }
  } catch (err) {
    console.error("Error adding posts:", err);
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// Get a specific post by id
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// Create a new post
const createPost = async (req, res, next) => {
  try {
    const existingPost = await Post.findOne({ text });
    if (existingPost) {
      return res.status(400).json({ message: "Post already exists" });
    }

    const user = await User.findById(req.session.passport.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      title: req.body.title,
      text: req.body.text,
      timestamp: new Date(),
      published: req.body.published,
      user: user.userId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

// Update a post by id
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    post.title = req.body.title;
    post.text = req.body.text;
    post.timestamp = new Date();
    post.published = req.body.published;
    post.user = req.session.passport.user;

    await post.save();

    res.json(post);
  } catch (err) {
    next(err);
  }
};

// Delete a post by id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    await post.remove();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addPosts,
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
