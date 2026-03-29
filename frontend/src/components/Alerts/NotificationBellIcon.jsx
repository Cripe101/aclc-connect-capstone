import { Bell } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";

const NotificationBellIcon = () => {
  const [count, setCount] = useState(0);
  const { user } = useContext(UserContext);
  const userId = user?._id;

  const fetchNotifications = async () => {
    const res = await axiosInstance.get(`/notifications/${userId}`);
    const unread = res.data.filter((notif) => !notif.isRead);
    setCount(unread.length);
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex relative">
      <p>
        <Bell />
      </p>
      {count > 0 && (
        <span className="absolute -top-2 font-semibold -right-1 text-xs bg-blue-600 rounded-full py-.5 px-1.5 text-blue-200">
          {count}
        </span>
      )}
    </div>
  );
};

export default NotificationBellIcon;
