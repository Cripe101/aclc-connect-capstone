const express = require("express")
const router = express.Router()
const { protect } = require("../middlewares//authMiddleware.js")
const { getDashboardSummary } = require("../controllers/dashboardController.js")


// Admin-Only Middleware
const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        next()
    } else {
        res.status(403).json({ message: "Access denied. Admins only." })
    }
}

router.get("/", protect, adminOnly, getDashboardSummary)


module.exports = router