import { useContext, useState } from "react";
import { BLOG_NAVBAR_DATA, SIDE_MENU_DATA } from "../../../utils/data.js";
import { LuLogOut } from "react-icons/lu";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import CharAvatar from "../../Cards/CharAvatar.jsx";
import { UserContext } from "../../../context/userContext.jsx";
import LogoutAlert from "../../Alerts/LogoutAlert.jsx";

const SideMenu = ({ activeMenu, isBlogMenu, setOpenSideMenu }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [tap, setTap] = useState(false);
  const location = useLocation();

  const handleClick = (route) => {
    if (route === "logout") {
      setShowLogoutAlert(true);
      return;
    }
    setOpenSideMenu((prevState) => !prevState);
    navigate(route);
  };

  const userRole = user?.role; // from auth context or redux

  const filteredMenu = SIDE_MENU_DATA.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <div className="bg-white md:w-65 h-full sticky top-0 z-10 rounded-lg md:rounded-none md:border-r md:border-r-gray-300">
      {user && (
        <div className="flex flex-col items-center justify-center gap-1 py-3 rounded-t-lg md:rounded-t-none bg-linear-to-r from-blue-500 via-blue-400 to-blue-300">
          {user?.profileImageUrl ? (
            <img
              className="w-16 h-16 object-cover object-center rounded-full"
              src={user?.profileImageUrl}
              alt="Profile Image"
            />
          ) : (
            <CharAvatar
              fullName={user?.name || ""}
              width="w-16"
              height="h-16"
              style="text-xl"
            />
          )}

          <div>
            <h5 className="text-white text-sm font-semibold text-center leading-6 mt-1">
              {user?.name || ""}
            </h5>

            <p className="text-xs font-medium text-gray-300 text-center">
              {user?.role || ""}
            </p>
          </div>
        </div>
      )}

      {(isBlogMenu ? BLOG_NAVBAR_DATA : filteredMenu).map((item, index) => (
        <div
          className="relative hover:bg-blue-100 mx-2 my-2 md:mt-5 active:bg-blue-100 rounded-full group duration-200"
          key={index}
        >
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-sm ${
              location.pathname == item.path
                ? "text-white bg-blue-700 shadow-sm"
                : ""
            } py-3 px-6 rounded-full mb-3 cursor-pointer`}
            onClick={() => {
              item.label.toLowerCase() === "courses offered"
                ? ""
                : handleClick(
                    item.label.toLowerCase() === "courses offered"
                      ? ""
                      : item.path,
                  );
              tap ? setTap(false) : setTap(true);
            }}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
          <section
            className={
              item.label.toLowerCase() === "courses offered"
                ? `${tap ? "flex" : "hidden"} absolute rounded-lg left-50 top-0 flex-col w-[120px] duration-200 bg-blue-50/90 backdrop-blur-sm`
                : "hidden"
            }
          >
            <NavLink
              onClick={() => setOpenSideMenu((prevState) => !prevState)}
              to={"/courses-offered/bachelors"}
              className="text-sm font-medium font-display py-1 px-4 cursor-pointer active:bg-blue-800 active:text-white rounded-lg hover:bg-blue-900 hover:text-white duration-200"
            >
              Degree
            </NavLink>
            <NavLink
              onClick={() => setOpenSideMenu((prevState) => !prevState)}
              to={"/courses-offered/tesda"}
              className="text-sm font-medium font-display py-1 px-4 cursor-pointer active:bg-blue-800 active:text-white rounded-lg hover:bg-blue-900 hover:text-white duration-200"
            >
              Diploma
            </NavLink>
            <NavLink
              onClick={() => setOpenSideMenu((prevState) => !prevState)}
              to={"/courses-offered/seniorhigh"}
              className="text-sm font-medium font-display py-1 px-4 cursor-pointer active:bg-blue-800 active:text-white rounded-lg hover:bg-blue-900 hover:text-white duration-200"
            >
              Senior High
            </NavLink>
          </section>
        </div>
      ))}

      {user && (
        <div className="p-2 flex">
          <button
            className={`w-full flex items-center mb-2 gap-3 text-base py-3 px-6 rounded-full cursor-pointer text-red-600 hover:bg-red-100 active:bg-red-100 active:scale-90 duration-200`}
            onClick={() => handleClick("logout")}
          >
            <LuLogOut className="text-xl" />
            Sign Out
          </button>
        </div>
      )}

      <LogoutAlert isOpen={showLogoutAlert} setIsOpen={setShowLogoutAlert} />
    </div>
  );
};

export default SideMenu;
