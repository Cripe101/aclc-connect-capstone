import { useState } from "react";

import Logo from "../../../assets/aclc-logo.svg";
import Login from "../../../components/Auth/Login";
import SignUp from "../../../components/Auth/Signup";

const AdminLogin = () => {
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <>
      <div className="bg-white py-5 border-b border-gray-50">
        <div className="container mx-auto">
          <img className="h-[26px] pl-6" src={Logo} alt="Logo" />
        </div>
      </div>

      <div className="min-h-[calc(100vh-67px)] flex items-center justify-center">
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/60">
          {currentPage === "login" ? (
            <Login setCurrentPage={setCurrentPage} isAdmin={true} />
          ) : (
            <SignUp setCurrentPage={setCurrentPage} isAdmin={true} />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
