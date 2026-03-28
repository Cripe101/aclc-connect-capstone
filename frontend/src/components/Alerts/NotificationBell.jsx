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
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/update/${id}`);

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );

      await axiosInstance.delete(`/notifications/delete/${id}`);

      setNotifications((prev) => prev.filter((n) => n._id !== id));
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div
      className={`${
        user?.role === "admin"
          ? "block"
          : user?.role === "offices"
            ? "block"
            : "hidden"
      }`}
    >
      <h1
        onClick={() => {
          setShow(!show);
        }}
        className="cursor-pointer hover:text-blue-800"
      >
        <NotificationBellIcon />
      </h1>
      <section
        className={`${show ? "flex" : "hidden"} flex-col fixed right-1 md:right-15 top-15 bg-blue-100 rounded-lg w-full text-xs max-w-[200px]`}
      >
        {notifications?.slice(0, 6).map((notif) => (
          <div
            className={`${notif.isRead ? "bg-green-600" : "bg-linear-to-r from-blue-200 via-blue-300 to-blue-400"} rounded-lg justify-center items-center font-semibold flex flex-col gap-1 p-2 m-2`}
            key={notif._id}
          >
            <p
              className={`${notif.message.toLowerCase() === "your post was rejected" ? "text-red-600" : "text-green-500"}`}
            >
              {notif.message}
            </p>

            {!notif.isRead && (
              <button
                className="px-2 py-0.5 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg active:scale-95 cursor-pointer duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  markAsRead(notif._id);
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default NotificationBell;
