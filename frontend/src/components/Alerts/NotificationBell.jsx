import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";
import NotificationBellIcon from "./NotificationBellIcon";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const userId = user?._id;

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get(`/notifications/${userId}`);

      const filterNotif = res.data.filter((notif) => !notif.isRead);
      setNotifications(filterNotif);
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

      // await axiosInstance.delete(`/notifications/delete/${id}`);

      setNotifications((prev) => prev.filter((n) => n._id !== id));
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = ({ slug, notifId }) => {
    user.role !== "admin"
      ? navigate("/admin/edit/" + slug)
      : navigate("/preview/" + slug);
    markAsRead(notifId);
    setShow(false);
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
        className={`${show ? "flex" : "hidden"} z-10 flex-col fixed right-1 md:right-15 top-15 bg-blue-100 rounded-lg w-full text-xs max-w-[200px]`}
      >
        {notifications?.slice(0, 6).map((notif) => (
          <div
            className={`${notif.isRead ? "" : "bg-linear-to-r from-blue-200 via-blue-300 to-blue-400"} cursor-pointer rounded-lg justify-center items-center font-semibold flex flex-col gap-1 p-2 m-2`}
            key={notif._id}
            onClick={() =>
              handleClick({
                slug: notif.postSlug,
                notifId: notif._id,
              })
            }
          >
            <p
              className={`${notif.message.toLowerCase() === "your post was rejected" ? "text-red-700" : notif.message.toLowerCase() === "new post need approval" ? "text-black" : "text-green-700"}`}
            >
              {notif.message}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default NotificationBell;
