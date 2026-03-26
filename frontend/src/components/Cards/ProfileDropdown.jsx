import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import {
  LuLogOut,
  LuUser,
  LuMail,
  LuKey,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import Modal from "../Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import LogoutAlert from "../Alerts/LogoutAlert";

const ProfileDropdown = () => {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({
    oldPassword: "",
    password: "",
    confirm: "",
  });
  const [showPwdVisibility, setShowPwdVisibility] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Password strength validator
  const validatePasswordStrength = (pwd) => {
    const minLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),./<>?'`~=+_-]/.test(pwd);

    const strength = [
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
    ].filter(Boolean).length;
    return { strength, minLength, hasUpper, hasLower, hasNumber, hasSpecial };
  };

  const pwdStrength = validatePasswordStrength(pwdForm.password);
  const strengthColor =
    pwdStrength.strength <= 2
      ? "text-red-500"
      : pwdStrength.strength <= 4
        ? "text-yellow-500"
        : "text-green-500";
  const strengthText =
    pwdStrength.strength <= 2
      ? "Weak"
      : pwdStrength.strength <= 4
        ? "Fair"
        : "Strong";

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

  const handleOpenPwd = () => {
    setIsPwdModalOpen(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setPwdForm({
      oldPassword: "",
      password: "",
      confirm: "",
    });
  };

  const handleUpdatePassword = async () => {
    if (
      !pwdForm.oldPassword ||
      !pwdForm.password ||
      pwdForm.password !== pwdForm.confirm
    ) {
      toast.error("Please provide old password and matching new passwords");
      return;
    }

    if (pwdStrength.strength < 3) {
      toast.error(
        "Password must be at least fair strength (8+ chars, mixed case, number)",
      );
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, {
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.password,
      });
      toast.success("Password updated successfully. Please re-login.");
      setIsPwdModalOpen(false);
      setPwdForm({ oldPassword: "", password: "", confirm: "" });
      setShowPwdVisibility({ old: false, new: false, confirm: false });
      // Clear token and redirect to login
      localStorage.removeItem("token");
      setTimeout(() => navigate("/admin-login"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
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
          <img
            src={
              user?.profileImageUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8AJM9wkP__z2M-hovSAWcTb_9XJ6smy3NKw&s"
            }
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-800"
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-52 md:w-72 bg-white rounded-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="bg-linear-to-r from-sky-50 to-cyan-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <img
                  src={
                    user.profileImageUrl ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8AJM9wkP__z2M-hovSAWcTb_9XJ6smy3NKw&s"
                  }
                  // alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-800"
                />
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
                  navigate(
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : user.role === "offices"
                        ? "/admin/dashboard"
                        : "/",
                  );
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-sky-50 transition-colors group"
              >
                <LuUser className="text-gray-400 group-hover:text-sky-500 transition-colors" />
                <span className="group-hover:text-sky-600 font-medium">
                  {user.role === "admin"
                    ? "Admin Dashboard"
                    : user.role === "offices"
                      ? "Dashboard"
                      : ""}
                </span>
              </button>

              {user.role === "admin" ? (
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
              ) : user.role === "offices" ? (
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
              ) : (
                ""
              )}

              {user.role !== ("admin" || "offices") ? (
                ""
              ) : (
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

              <button
                onClick={handleOpenPwd}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-sky-50 transition-colors group"
              >
                <LuKey className="text-gray-400 group-hover:text-sky-500 transition-colors" />
                <span className="group-hover:text-sky-600 font-medium">
                  Update Password
                </span>
              </button>
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

      {/* Update Password Modal */}
      <Modal
        isOpen={isPwdModalOpen}
        onClose={() => setIsPwdModalOpen(false)}
        title="Update Password"
      >
        <div className="space-y-4 w-full max-w-md mx-auto p-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPwdVisibility.old ? "text" : "password"}
                value={pwdForm.oldPassword}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, oldPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPwdVisibility({
                    ...showPwdVisibility,
                    old: !showPwdVisibility.old,
                  })
                }
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPwdVisibility.old ? (
                  <LuEyeOff size={20} />
                ) : (
                  <LuEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPwdVisibility.new ? "text" : "password"}
                value={pwdForm.password}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPwdVisibility({
                    ...showPwdVisibility,
                    new: !showPwdVisibility.new,
                  })
                }
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPwdVisibility.new ? (
                  <LuEyeOff size={20} />
                ) : (
                  <LuEye size={20} />
                )}
              </button>
            </div>
            {pwdForm.password && (
              <div className="mt-2 text-sm">
                <p className={`font-medium ${strengthColor}`}>
                  Strength: {strengthText}
                </p>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li className={pwdStrength.minLength ? "text-green-600" : ""}>
                    ✓ At least 8 characters
                  </li>
                  <li className={pwdStrength.hasUpper ? "text-green-600" : ""}>
                    ✓ Uppercase letter
                  </li>
                  <li className={pwdStrength.hasLower ? "text-green-600" : ""}>
                    ✓ Lowercase letter
                  </li>
                  <li className={pwdStrength.hasNumber ? "text-green-600" : ""}>
                    ✓ Number
                  </li>
                  <li
                    className={pwdStrength.hasSpecial ? "text-green-600" : ""}
                  >
                    ✓ Special character
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPwdVisibility.confirm ? "text" : "password"}
                value={pwdForm.confirm}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, confirm: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPwdVisibility({
                    ...showPwdVisibility,
                    confirm: !showPwdVisibility.confirm,
                  })
                }
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPwdVisibility.confirm ? (
                  <LuEyeOff size={20} />
                ) : (
                  <LuEye size={20} />
                )}
              </button>
            </div>
            {pwdForm.confirm && pwdForm.password !== pwdForm.confirm && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
            {pwdForm.confirm && pwdForm.password === pwdForm.confirm && (
              <p className="text-xs text-green-500 mt-1">Passwords match ✓</p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => {
                handleCancel();
                setIsPwdModalOpen(false);
              }}
              className="px-4 py-2 border border-red-600 cursor-pointer text-red-600 rounded-lg hover:bg-red-600 hover:text-white duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePassword}
              className="px-4 py-2 bg-blue-700 cursor-pointer text-white rounded-lg hover:bg-blue-800 transition disabled:bg-blue-200"
              disabled={isLoading || pwdStrength.strength < 3}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileDropdown;
