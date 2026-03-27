import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // 📡 fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // optional: auto refresh every 5s
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔢 unread count
  const unreadCount = notifications?.filter((n) => !n.isRead).length;

  // ✅ mark as read
  const handleRead = async (id) => {
    await axiosInstance.put(`/notifications/${id}`);
    fetchNotifications();
  };

  return (
    <div className="relative">
      {/* 🔔 Bell */}
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-6 h-6" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📥 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-2 z-50">
          {notifications?.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            notifications?.map((notif) => (
              <div
                key={notif._id}
                onClick={() => handleRead(notif._id)}
                className={`p-2 text-sm rounded cursor-pointer mb-1 ${
                  notif.isRead ? "bg-white" : "bg-blue-100"
                }`}
              >
                {notif.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
