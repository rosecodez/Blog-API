const User = require("../models/user");

let posts = [
  {
    id: 1,
    title: "How I built my first website",
    timestamp: new Date(),
    published: true,
    user: new User(),
  },
  {
    id: 2,
    title: "How I started coding",
    timestamp: new Date(),
    published: true,
    user: new User(),
  },
];

// Get all posts
const getAllPosts = (req, res) => {
  res.json(posts);
};

// Get a specific post by id
const getPostById = (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((post) => post.id === postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
};

// Create a new post
const createPost = (req, res) => {
  const { title, timestamp, published, userId } = req.body;
  const newPost = {
    id: posts.length + 1,
    title,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    published: published !== undefined ? published : true,
    user: userId,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
};

// Update a post by id
const updatePost = (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, timestamp, published, userId } = req.body;
  const index = posts.findIndex((post) => post.id === postId);
  if (index === -1) {
    return res.status(404).json({ message: "Post not found" });
  }
  posts[index].title = title;
  if (timestamp) {
    posts[index].timestamp = new Date(timestamp);
  }
  if (published !== undefined) {
    posts[index].published = published;
  }
  if (userId) {
    posts[index].user = userId;
  }
  res.json(posts[index]);
};

// Delete a post by id
const deletePost = (req, res) => {
  const postId = parseInt(req.params.id);
  const index = posts.findIndex((post) => post.id === postId);
  if (!index) {
    return res.status(404).json({ message: "Post not found" });
  }
  posts.splice(index, 1);
  res.sendStatus(204);
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
