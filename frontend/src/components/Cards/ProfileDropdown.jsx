import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { LuLogOut, LuUser, LuGithub, LuMail } from "react-icons/lu";
import LogoutAlert from "../Alerts/LogoutAlert";

const ProfileDropdown = () => {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogoutClick = () => {
    setShowLogoutAlert(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-blue-600 flex items-center justify-center">
            <img
              src={
                user?.profileImageUrl ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnVvDx9Kezwg0D77WzdAUzjOEHf1WEqQ3-fA&s"
              }
              alt={user?.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute -right-6 md:right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="bg-linear-to-r from-sky-50 to-cyan-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-sky-400 to-cyan-500 p-0.5 flex items-center justify-center">
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  navigate(user.role === "admin" ? "/admin/dashboard" : "/");
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-sky-50 transition-colors group"
              >
                <LuUser className="text-gray-400 group-hover:text-sky-500 transition-colors" />
                <span className="group-hover:text-sky-600 font-medium">
                  {user.role === "admin" ? "Admin Dashboard" : "Home"}
                </span>
              </button>

              {user.role === "admin" && (
                <button
                  onClick={() => {
                    navigate("/");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-sky-50 transition-colors group"
                >
                  <LuMail className="text-gray-400 group-hover:text-sky-500 transition-colors" />
                  <span className="group-hover:text-sky-600 font-medium">
                    Home
                  </span>
                </button>
              )}

              {user.role !== "admin" && (
                <button
                  onClick={() => {
                    navigate("/about");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-sky-50 transition-colors group"
                >
                  <LuMail className="text-gray-400 group-hover:text-sky-500 transition-colors" />
                  <span className="group-hover:text-sky-600 font-medium">
                    About
                  </span>
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Logout Button */}
            <div className="p-2">
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <LuLogOut className="group-hover:scale-110 transition-transform" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                ACLC Connect © 2025
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Logout Alert */}
      <LogoutAlert isOpen={showLogoutAlert} setIsOpen={setShowLogoutAlert} />
    </>
  );
};

export default ProfileDropdown;
