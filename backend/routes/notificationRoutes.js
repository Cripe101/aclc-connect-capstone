const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

router.get("/:userId", getNotifications);
router.put("/:id", markAsRead);

module.exports = router;
