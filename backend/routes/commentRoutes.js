const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares//authMiddleware.js");
const {
  addComment,
  getCommentsByPost,
  deleteComment,
  getCommentsOnUserPosts,
} = require("../controllers/commentController.js");

router.post("/:postId", protect, addComment);
router.get("/:postId", getCommentsByPost);
// router.get("/all", getAllComments);
router.get("/user-posts/:userId", protect, getCommentsOnUserPosts);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
