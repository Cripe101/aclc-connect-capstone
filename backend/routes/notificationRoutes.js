const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

router.get("/:userId", getNotifications);
router.patch("/update/:id", markAsRead);
router.delete("/delete/:id", deleteNotification);

module.exports = router;
