import { Bell } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";

const NotificationBellIcon = () => {
  const [count, setCount] = useState(0);
  const { user } = useContext(UserContext);
  const userId = user?._id;

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await axiosInstance.get(`/notifications/${userId}`);

      const unread = res.data.filter((n) => !n.is_read);
      setCount(unread.length);
    };

    fetchNotifications();
  }, []);
  return (
    <div>
      <Bell /> {count > 0 && <span>({count})</span>}
    </div>
  );
};

export default NotificationBellIcon;
