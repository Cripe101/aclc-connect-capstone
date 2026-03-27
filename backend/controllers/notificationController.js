const Notification = require("../models/Notification");

// get notifications of user
const getNotifications = async (req, res) => {
  try {
    const data = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

// create notification (you call this manually)
const createNotification = async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.json(notif);
  } catch (err) {
    res.status(500).json(err);
  }
};

// mark as read
const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });
    res.json({ message: "Read" });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
};
