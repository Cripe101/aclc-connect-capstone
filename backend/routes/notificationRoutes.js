const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
} = require("../controllers/notificationController");

router.get("/notifications/", getNotifications);
router.post("/notifications/", createNotification);
router.put("/notifications/:id", markAsRead);

module.exports = router;
