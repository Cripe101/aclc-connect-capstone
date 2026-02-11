import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu.jsx";
import ProfileDropdown from "../../Cards/ProfileDropdown.jsx";

import Logo from "../../../assets/aclc-logo-ormoc.png";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 justify-between items-center">
      <div className="flex items-center gap-5">
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

        <img className="scale-200 w-10 p-2 md:" src={Logo} alt="" />
        <h1 className="font-display font-semibold">ACLC Connect</h1>
      </div>

      <div>
        <ProfileDropdown />
      </div>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} setOpenSideMenu={setOpenSideMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
