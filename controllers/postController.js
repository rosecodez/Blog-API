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
        text: "It was a great experience diving into the world of web development and building my first website. Starting with a curiosity-driven decision and armed only with determination and online tutorials, I ventured into unfamiliar territory.Initially, HTML and CSS seemed like a foreign language, but as I began crafting the structure of my site with <div>, <p>, and <img> tags, I felt a sense of accomplishment with every line of code. The ability to style elements using CSS was particularly fascinating, as I experimented with colors, fonts, and layouts to create a visually appealing design.As I progressed, the challenge of making my site responsive across different devices pushed me to explore media queries and responsive design principles. Understanding how to adapt layouts and styles based on screen size was both challenging and rewarding.Introducing JavaScript added another layer of interactivity to my website. From simple animations to form validations, each new script I implemented felt like a triumph over previously daunting code.Testing and debugging became integral parts of my process, as I painstakingly ensured my site was error-free and displayed consistently across various browsers. The satisfaction of solving each bug and seeing my site come together was immensely gratifying.Finally, launching my website to the world was a culmination of weeks of learning and effort. Purchasing a domain name, setting up hosting, and seeing my creation live online marked a milestone in my journey.Reflecting on this experience, building my first website was not just about learning technical skills. It was a journey of self-discovery, perseverance, and creative expression. It ignited a passion for web development that continues to drive me forward, eager to explore new technologies and create meaningful digital experiences.Building my first website taught me that with dedication and a willingness to learn, anyone can turn their ideas into reality on the web. It was more than just coding—it was the beginning of an exciting journey into the limitless possibilities of the digital world.",
        timestamp: new Date(),
        published: true,
        userId: "6679b6dd5b9e70e350d8a210",
      },
      {
        id: 2,
        title: "How I started coding",
        text: "My journey into the world of coding began with a fascination for creating interactive and dynamic experiences on the web. JavaScript, renowned for its versatility and fundamental role in web development, became my gateway into the realm of programming. I was initially drawn to JavaScript because of its pivotal role in frontend web development. With determination and a thirst for knowledge, I began my journey to learn this powerful language.The initial challenge was grasping the fundamentals. From variables and data types to functions and control structures, each concept presented a new puzzle to solve. I immersed myself in online tutorials and courses that provided a structured introduction to JavaScript syntax and programming principles.  One of the early joys was writing code that interacted with elements on a webpage. Whether creating event listeners to respond to user actions or manipulating the DOM to dynamically update content, each achievement fueled my excitement and motivated me to delve deeper.As my understanding grew, I explored advanced JavaScript concepts such as asynchronous programming, closures, and object-oriented programming principles. Projects played a pivotal role in my learning journey, from building interactive forms and mini-games to developing web applications that solved real-world problems.  Beyond technical skills, JavaScript taught me crucial principles of software development, such as code organization, debugging techniques, and optimizing performance. These skills not only improved my projects but also prepared me for professional opportunities in web development. Reflecting on my journey, learning JavaScript has been transformative. It has empowered me to turn ideas into reality, solve complex problems, and contribute to the vibrant community of developers shaping the future of the web.If you're considering learning JavaScript, my advice is simple: dive in. Embrace the challenges, build projects that inspire you, and enjoy the journey of mastering one of the most influential languages in modern web development. Your coding adventure awaits!",
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
