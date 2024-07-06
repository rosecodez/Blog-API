const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Passport authentication error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!user) {
      if (info && info.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    res.locals.user = user;
    next();
  })(req, res, next);
};

// GET all users
router.get("/", userController.getAllUsers);

// POST create a new user
router.post("/createUser", userController.createUser);

// PUT update a user by id
router.put("/:userId", authMiddleware, userController.updateUser);

// DELETE a user by id
router.delete("/:userId", authMiddleware, userController.deleteUser);

// signup
router.get("/signup", userController.signupUser);
router.post("/signup", userController.signupUserPost);

// login
router.get("/login", userController.loginUser);
router.post("/login", userController.loginUserPost);

// display user details
router.get("/user-details", authMiddleware, userController.userDetails);

// logout
router.get("/logout", authMiddleware, userController.logoutUser);

module.exports = router;
