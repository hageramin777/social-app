import React, { useContext } from "react";
import { authContext } from "../context/AuthContextProvider";
import { Link, useNavigate } from "react-router-dom";

export default function MyNavbar() {
  const navigate = useNavigate();
  const { token, setToken } = useContext(authContext);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <span className="text-[#21144996] text-4xl font-extrabold leading-tight mb-2">
                 Social Hub
              </span>

       {/* Links */}
{token && (
  <div className="hidden sm:flex items-center gap-8">
    <Link
      to="/"
      className="flex items-center gap-1.5 text-blue-600 text-sm font-medium border-b-2 border-blue-600 pb-1"
    >
      Feed
    </Link>

    <Link
      to="/profile"
      className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm font-medium"
    >
      Profile
    </Link>
  </div>
)}

{/* User pill */}
{token ? (
  <nav className="flex items-center gap-4">
    <button
      onClick={() => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/register");
      }}
      className="text-gray-600 hover:text-blue-500 text-sm font-medium"
    >
      Logout
    </button>
  </nav>
) : (
  <div className="flex items-center gap-4">
    <Link
      to="/login"
      className="text-gray-600 hover:text-blue-500 text-sm font-medium"
    >
      Login
    </Link>

    <Link
      to="/register"
      className="text-gray-600 hover:text-blue-500 text-sm font-medium"
    >
      Register
    </Link>
  </div>
)}
</div>
    </nav>
  );
} 