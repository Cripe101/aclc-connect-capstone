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
      await axiosInstance.patch(`/notifications/${id}`);

      // update UI instantly
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, is_read: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <h1
        onClick={() => {
          setShow(!show);
        }}
        className="cursor-pointer hover:text-blue-800"
      >
        <NotificationBellIcon />
      </h1>
      <section
        className={`${show ? "flex" : "hidden"} bg-blue-50 w-full max-w-[300px]`}
      >
        {notifications?.map((notif) => (
          <div
            key={notif._id}
            style={{
              background: notif.is_read ? "#eee" : "#cce5ff",
              margin: "5px",
              padding: "10px",
            }}
          >
            <p>{notif.message}</p>

            {!notif.is_read && (
              <button onClick={() => markAsRead(notif._id)}>
                Mark as read
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default NotificationBell;
