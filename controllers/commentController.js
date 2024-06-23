const User = require("../models/user");

let comments = [
  {
    id: 1,
    text: "Your site looks awesome!",
    timestamp: new Date(),
    user: new User(),
    postId: 1,
  },
  {
    id: 2,
    text: "How did you start coding?",
    timestamp: new Date(),
    user: new User(),
    postId: 2,
  },
];

// Get all comments for a specific post
const getAllComments = (req, res) => {
  const { postId } = req.params;
  const postComments = comments.filter(
    (comment) => comment.postId === parseInt(postId)
  );
  res.json(postComments);
};

// Get a specific comment by id for a post
const getCommentById = (req, res) => {
  console.log("Request received for URL:", req.url);
  console.log("Params:", req.params);
  const { postId, commentId } = req.params;
  const comment = comments.find(
    (comment) =>
      comment.id === parseInt(commentId) && comment.postId === parseInt(postId)
  );
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  res.json(comment);
};

// Create a new comment for a post
const createComment = (req, res) => {
  const { text, timestamp, userId } = req.body;
  const postId = req.params.postId;
  const newComment = {
    id: comments.length + 1,
    text,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    user: userId,
    postId: parseInt(postId),
  };
  comments.push(newComment);
  res.status(201).json(newComment);
};

// Update a comment by id for a post
const updateComment = (req, res) => {
  const { postId, commentId } = req.params;
  const { text, timestamp, userId } = req.body;
  const index = comments.findIndex(
    (comment) =>
      comment.id === parseInt(commentId) && comment.postId === parseInt(postId)
  );
  if (index === -1) {
    return res.status(404).json({ message: "Comment not found" });
  }
  comments[index].text = text;
  comments[index].timestamp = timestamp
    ? new Date(timestamp)
    : comments[index].timestamp;
  comments[index].user = userId ? userId : comments[index].user;
  res.json(comments[index]);
};

// Delete a comment by id for a post
const deleteComment = (req, res) => {
  const { postId, commentId } = req.params;
  const index = comments.findIndex(
    (comment) =>
      comment.id === parseInt(commentId) && comment.postId === parseInt(postId)
  );
  if (index === -1) {
    return res.status(404).json({ message: "Comment not found" });
  }
  comments.splice(index, 1);
  res.sendStatus(204);
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
