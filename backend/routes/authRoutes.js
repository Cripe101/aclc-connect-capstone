const express = require("express")
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController.js")
const { protect } = require("../middlewares/authMiddleware.js")
const { upload, uploadToCloudinary } = require("../middlewares/uploadMiddleware.js")

const router = express.Router()

// Auth routes
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", protect, getUserProfile)

router.post("/upload-image", upload.single("image"), uploadToCloudinary, (req, res) => {
    res.status(200).json({ imageUrl: req.imageUrl })
})



module.exports = router