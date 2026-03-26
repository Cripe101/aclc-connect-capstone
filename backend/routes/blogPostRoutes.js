const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware.js");
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  getPostsByTag,
  searchPosts,
  incrementView,
  likePost,
  getTopPosts,
  getMyPosts,
  approvePost,
} = require("../controllers/blogPostController.js");

// Admin-Only Middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

const adOfOnly = (req, res, next) => {
  if ((req.user && req.user.role === "admin") || "offices") {
    next();
  } else {
    res.status(403).json({ message: "Access denied." });
  }
};

const officesOnly = (req, res, next) => {
  if (req.user && req.user.role === "offices") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

router.post("/", protect, officesOnly, createPost);
router.get("/", getAllPosts);
router.get("/slug/:slug", adOfOnly, getPostBySlug);
router.get("/me", protect, officesOnly, getMyPosts);
router.put("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, deletePost);
router.get("/tag/:tag", getPostsByTag);
router.get("/search", searchPosts);
router.post("/:id/view", incrementView);
router.post("/:id/like", protect, likePost);
router.get("/trending", getTopPosts);
router.patch("/approve/:id", protect, adminOnly, approvePost);

module.exports = router;
