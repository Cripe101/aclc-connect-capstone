import { useContext, useState } from "react";
import Logo from "../../../assets/aclc-logo-ormoc.png";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, NavLink } from "react-router-dom";
import { BLOG_NAVBAR_DATA } from "../../../utils/data.js";
import SideMenu from "./SideMenu.jsx";
import { UserContext } from "../../../context/userContext.jsx";
import ProfileDropdown from "../../Cards/ProfileDropdown.jsx";
import AuthModel from "../../Auth/AuthModel.jsx";
import SearchBarPopup from "../../../pages/Blog/components/SearchBarPopup.jsx";
import NotificationBell from "../../Alerts/NotificationBell.jsx";

const BlogNavbar = ({ activeMenu }) => {
  const { user, setOpenAuthForm } = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);

  return (
    <>
      <div className="bg-white border border-b border-gray-400/50 backdrop-blur-[2px] py-2 px-3 md:px-7 sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between gap-5">
          <div className="flex">
            <button
              className="block lg:hidden text-black -mt-1"
              onClick={() => {
                setOpenSideMenu(!openSideMenu);
              }}
            >
              {openSideMenu ? (
                <HiOutlineX className="text-2xl" />
              ) : (
                <HiOutlineMenu className="text-2xl" />
              )}
            </button>

            <Link className="flex gap-3 items-center justify-center" to="/">
              <img className="h-16 pl-2 md:pl-5" src={Logo} alt="" />
              <h1 className="font-display font-semibold text-sm md:text-base">
                ACLC Connect
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {BLOG_NAVBAR_DATA.map((item) => {
              if (item?.onlySideMenu) return;

              return (
                <NavLink
                  key={item.id}
                  to={
                    item?.path.toLowerCase() === "/courses-offered"
                      ? ""
                      : item?.path
                  }
                  end
                >
                  {({ isActive }) => (
                    <li
                      className={`${isActive && item.label.toLowerCase() !== "courses offered" ? "text-white" : "text-black"} font-medium list-none relative group cursor-pointer`}
                    >
                      {item.label}
                      <span
                        className={
                          item.label.toLowerCase() === "courses offered"
                            ? ""
                            : `-z-10 absolute inset-x-0 bottom-0 ${item.label.toLowerCase() === "announcements" ? "w-[120%] -left-3" : "w-[130%] -left-1.5"} rounded-lg mt-0.5 origin-left bg-blue-700 duration-200 ${
                                isActive ? "scale-x-100" : "scale-x-0"
                              } ${isActive ? "h-full" : "h-1"} group-hover:scale-x-100`
                        }
                      ></span>
                      <section
                        className={
                          item.label.toLowerCase() === "courses offered"
                            ? "absolute hidden group-hover:grid duration-200 rounded-lg bg-blue-50/50 backdrop-blur-sm"
                            : "hidden"
                        }
                      >
                        <Link
                          to={"/courses-offered/bachelors"}
                          className="text-sm font-medium font-display rounded-t-lg py-1 px-4 cursor-pointer hover:bg-blue-900 hover:text-white duration-200"
                        >
                          Degree
                        </Link>
                        <Link
                          to={"/courses-offered/tesda"}
                          className="text-sm font-medium font-display py-1 px-4 cursor-pointer hover:bg-blue-900 hover:text-white duration-200"
                        >
                          Diploma
                        </Link>
                        <Link
                          to={"/courses-offered/seniorhigh"}
                          className="text-sm font-medium font-display rounded-b-lg py-1 px-4 cursor-pointer hover:bg-blue-900 hover:text-white duration-200"
                        >
                          Senior High
                        </Link>
                      </section>
                    </li>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* <button
              className="hover:text-sky-500 cursor-pointer"
              onClick={() => setOpenSearchBar(true)}
            >
              <LuSearch className="text-[22px]" />
            </button> */}
            <section>
              <NotificationBell />
            </section>

            {!user ? (
              <button
                className="flex items-center justify-center gap-3 bg-blue-600 text-xs md:text-sm font-semibold text-white px-5 md:px-7 py-2 rounded-xl hover:bg-blue-700 hover:text-white transition-colors cursor-pointer "
                onClick={() => setOpenAuthForm(true)}
              >
                Login
              </button>
            ) : (
              <div className="block">
                <ProfileDropdown />
              </div>
            )}
          </div>

          {openSideMenu && (
            <div className="fixed top-[61px] -ml-4 bg-white ">
              <SideMenu
                activeMenu={activeMenu}
                isBlogMenu
                setOpenSideMenu={setOpenSideMenu}
              />
            </div>
          )}
        </div>
      </div>
      <AuthModel />
      {/* <SearchBarPopup isOpen={openSearchBar} setIsOpen={setOpenSearchBar} /> */}
    </>
  );
};

export default BlogNavbar;
