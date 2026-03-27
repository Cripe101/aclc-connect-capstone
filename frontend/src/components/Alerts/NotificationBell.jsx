import { useContext, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";
import NotificationBellIcon from "./NotificationBellIcon";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const { user } = useContext(UserContext);

  const userId = user?._id;

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get(`/notifications/${userId}`);
      setNotifications(res.data);

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/update/${id}`);

      // update UI instantly
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );

      // 3️⃣ Delete the notification after marking as read
      await axiosInstance.delete(`/notifications/delete/${id}`);

      // 4️⃣ Remove it from UI
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  return (
    <div className="relative">
      <h1
        onClick={() => {
          setShow(!show);
        }}
        className="cursor-pointer hover:text-blue-800"
      >
        <NotificationBellIcon />
      </h1>
      <section
        className={`${show ? "flex" : "hidden"} flex-col fixed right-10 bg-blue-50 w-full text-xs max-w-[200px]`}
      >
        {notifications?.slice(0, 6).map((notif) => (
          <div
            className="flex flex-col gap-1"
            key={notif._id}
            style={{
              background: notif.isRead ? "#eee" : "#cce5ff",
              margin: "5px",
              padding: "10px",
            }}
          >
            <p>{notif.message}</p>

            {!notif.isRead && (
              <button
                className="px-2 py-0.5 bg-blue-300 rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  markAsRead(notif._id);
                }}
              >
                Read
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default NotificationBell;
