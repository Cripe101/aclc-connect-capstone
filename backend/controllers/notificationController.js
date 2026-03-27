const Notification = require("../models/notificationModel");

// get notifications of user
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notif = await Notification.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// mark as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }, // returns updated document
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndDelete(req.params.id);
    if (!notif)
      return res.status(404).json({ message: "Notification not found" });
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
};
