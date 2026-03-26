const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
  updateUser,
  changePassword,
  approvePost,
  rejectPost,
} = require("../controllers/authController.js");
const { protect } = require("../middlewares/authMiddleware.js");
const {
  upload,
  uploadToCloudinary,
} = require("../middlewares/uploadMiddleware.js");

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// User management routes (Admin only)
router.get("/users", protect, getAllUsers);
router.delete("/users/:id", protect, deleteUser);
router.put("/users/:id", protect, updateUser);
router.put("/change-password", protect, changePassword);

router.post(
  "/upload-image",
  upload.single("image"),
  uploadToCloudinary,
  (req, res) => {
    res.status(200).json({ imageUrl: req.imageUrl });
  },
);

module.exports = router;
