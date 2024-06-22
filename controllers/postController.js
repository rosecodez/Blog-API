const Post = require("../models/post");
const User = require("../models/user");
const router = express.Router();

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

// GET all posts
router.get("/", (req, res) => {
  res.json(posts);
});

// Get a specific post by id
router.get("/:id", (req, res) => {
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

// POST create a new post
router.post("/", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    title: title.req.body,
    timestamp: new Date(),
    published: true,
    user: new User(),
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// PUT update post by id
router.put("/:id", (req, res) => {
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  post.title = title;
  post.content = content;
  res.json(post);
});

// DELETE post by id
router.delete("/:id", (req, res) => {
  const index = posts.findIndex((post) => post.id === id);
  if (!index) {
    return res.status(404).json({ message: "Post not found" });
  }
  posts.splice(index, 1);
  res.sendStatus(204);
});

module.exports = router;
