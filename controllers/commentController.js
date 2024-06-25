const User = require("../models/user");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

async function addComments() {
  let comments = [
    {
      text: "Your site looks awesome!",
      timestamp: new Date(),
      user: new User(),
      postId: 1,
    },
    {
      text: "How did you start coding?",
      timestamp: new Date(),
      user: new User(),
      postId: 2,
    },
  ];

  for (let comment of comments) {
    try {
      const existingComment = await Comment.findOne({
        text: comment.text,
      });
      if (!existingComment) {
        const newComment = new Comment(comment);
        await newComment.save();
        console.log(`comment ${newComment.text} added`);
      }
    } catch (err) {
      console.error(`Error adding comment ${comment.text}:`, err);
    }
  }
}

// Get all comments for a specific post
const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// Get a specific comment by id for a post
const getCommentById = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

// Create a new comment for a post
const createComment = async (req, res, next) => {
  const { text } = req.body;
  try {
    const existingComment = await Comment.findOne({ text });
    if (existingComment) {
      return res.status(400).json({ message: "Comment already exists" });
    }

    const user = await User.findById("6679b6dd5b9e70e350d8a210");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = new Comment({
      text: "That's really interesting. nice job",
      timestamp: new Date(),
      user: user._id,
      postId: req.params.postId,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
};

// Update a comment by id for a post
const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.text = "hmm";
    comment.timestamp = new Date();
    comment.user = comment.user;

    await comment.save();

    res.json(comment);
  } catch (err) {
    next(err);
  }
};

// Delete a comment by id for a post
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addComments,
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
