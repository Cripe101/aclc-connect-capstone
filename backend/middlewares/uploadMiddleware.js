const multer = require('multer');
const fs = require('fs').promises
const cloudinary = require('../config/cloudinary.js')

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'), false);
    }
}

const upload = multer({storage, fileFilter})

// Cloudinary upload middleware
const uploadToCloudinary = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        // Upload to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            folder: "aclc-connect",
        })

        const imageUrl = imageUpload.secure_url

        // Delete local temp file after successful upload
        try {
            await fs.unlink(req.file.path)
        } catch (err) {
            console.warn("Failed to remove local file:", err.message)
        }

        // Attach imageUrl to request for next handler
        req.imageUrl = imageUrl
        next()
    } catch (error) {
        console.error("Image upload error:", error)
        // Attempt to clean up local file if it exists
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path)
            } catch (err) {
                console.warn("Failed to remove local file on error:", err.message)
            }
        }
        res.status(500).json({ message: "Failed to upload image", error: error.message })
    }
}

module.exports = { upload, uploadToCloudinary }
