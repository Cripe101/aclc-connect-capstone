import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Input from "../Inputs/Input";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths";
import { LuMail, LuLock, LuArrowRight } from "react-icons/lu";

const Login = ({ setCurrentPage, isAdmin = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser, setOpenAuthForm } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle login from submit
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      setIsLoading(false);
      return;
    }

    setError("");

    // Login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Redirect based on role
        if (role === "admin") {
          setOpenAuthForm(false);
          navigate("/admin/dashboard");
          return;
        } else {
          navigate("/");
        }

        setOpenAuthForm(false);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full grid md:grid-cols-2 flex-row items-stretch overflow-hidden bg-white">
      {/* Left Side - Form */}
      <div className="w-full flex flex-col justify-center p-6">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-block p-3 bg-linear-to-br from-blue-300 to-blue-400 rounded-full mb-4">
            <LuMail className="text-2xl text-blue-800" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <div className="relative flex items-center">
              <LuMail className="absolute left-3 text-gray-400" />
              <input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder="you@example.com"
                type="email"
                className="w-full pl-10 pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-base"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <LuLock className="absolute left-3 text-gray-400" />
              <input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Enter your password"
                type="password"
                className="w-full pl-10 pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-base"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 md:py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold rounded-xl active:scale-[99%] duration-200 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <>
                Sign In
                <LuArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Sign Up Link */}
          <h1 className="text-center text-sm text-gray-600 mt-8">
            Don't have an account? go to admission office
            {/* <button
              type="button"
              onClick={() => setCurrentPage("signup")}
              className="font-semibold text-sky-600 hover:text-sky-700 transition-colors"
            >
              Create one
            </button> */}
          </h1>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-12">
          {isAdmin
            ? "Admin Login - Enter your credentials"
            : "Member Login - Welcome to ACLC Connect"}
        </p>
      </div>

      {/* Right Side - Gradient Background */}
      <div className="hidden md:flex bg-linear-to-br from-blue-800 to-blue-700 items-center justify-center relative overflow-hidden p-5">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/30 rounded-full -ml-40 -mb-40"></div>

        {/* Content */}
        <div className="relative z-10 text-white text-center max-w-md">
          <div className="mb-6">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              ACLC Connect
            </h2>
            <p className="text-lg lg:text-xl text-sky-50 leading-relaxed">
              Your gateway to knowledge, innovation, and community excellence.
            </p>
          </div>

          <div className="space-y-4 text-sm lg:text-base text-sky-50">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <span>Explore our blog posts</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <span>Connect with our community</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <span>Stay informed and inspired</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
