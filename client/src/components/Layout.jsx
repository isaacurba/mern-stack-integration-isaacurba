// client/src/components/Layout.jsx

import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Layout = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login'; 
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-indigo-100 transition">
            MERN Blog
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex items-center space-x-6">
              
              {/* 1. Main Navigation Links (Always First) */}
              <li>
                <Link to="/" className="hover:text-indigo-200 transition font-medium">
                  Home
                </Link>
              </li>

              {user ? (
                <>
                  {/* 2. 'Write Post' is now grouped with Home */}
                  <li>
                    <Link
                      to="/create"
                      className="text-white hover:text-indigo-200 transition font-medium"
                    >
                      Write Post
                    </Link>
                  </li>

                  {/* 3. Separator / User Info (Pushed to the right) */}
                  <li className="h-6 w-px bg-indigo-400 mx-2"></li> {/* Vertical Divider */}
                  
                  <li>
                    <span className="text-indigo-200 text-sm font-semibold">
                      {user.username}
                    </span>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm px-4 py-2 rounded shadow-sm transition"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* Guest Options */}
                  <li>
                    <Link to="/login" className="hover:text-indigo-200 transition font-medium">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="bg-white text-indigo-600 px-4 py-2 rounded-md font-bold hover:bg-indigo-50 transition shadow-sm"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-gray-400 text-center py-6 mt-auto">
        <p>© {new Date().getFullYear()} MERN Blog Application</p>
      </footer>
    </div>
  );
};

export default Layout;