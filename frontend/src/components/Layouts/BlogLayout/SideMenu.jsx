import React, { useContext, useState } from "react";
import { BLOG_NAVBAR_DATA, SIDE_MENU_DATA } from "../../../utils/data.js";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../../Cards/CharAvatar.jsx";
import { UserContext } from "../../../context/userContext.jsx";
import LogoutAlert from "../../Alerts/LogoutAlert.jsx";

const SideMenu = ({ activeMenu, isBlogMenu, setOpenSideMenu }) => {
  const { user, setUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const handleClick = (route) => {
    if (route === "logout") {
      setShowLogoutAlert(true);
      return;
    }
    setOpenSideMenu((prevState) => !prevState);
    navigate(route);
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      {user && (
        <div className="flex flex-col items-center justify-center gap-1 mt-3 mb-7">
          {user?.profileImageUrl ? (
            <img
              className="w-20 h-20 bg-slate-400 rounded-full"
              src={
                user?.profileImageUrl ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Profile Image"
            />
          ) : (
            <CharAvatar
              fullName={user?.name || ""}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}

          <div>
            <h5 className="text-gray-950 font-semibold text-center leading-6 mt-1">
              {user?.name || ""}
            </h5>

            <p className="text-[13px] font-medium text-gray-800 text-center">
              {user?.email || ""}
            </p>
          </div>
        </div>
      )}

      {(isBlogMenu ? BLOG_NAVBAR_DATA : SIDE_MENU_DATA).map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu == item.label
              ? "text-white bg-linear-to-r from-sky-500 to-cyan-400"
              : ""
          } py-3 px-6 rounded-lg mb-3 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}

      {user && (
        <button
          className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 cursor-pointer text-red-600 hover:bg-red-50 transition-colors`}
          onClick={() => handleClick("logout")}
        >
          <LuLogOut className="text-xl" />
          Sign Out
        </button>
      )}

      <LogoutAlert isOpen={showLogoutAlert} setIsOpen={setShowLogoutAlert} />
    </div>
  );
};

export default SideMenu;
