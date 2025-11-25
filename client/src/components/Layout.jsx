import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Layout = () => {
  const navigate = useNavigate();
  
  // 1. Check if user is logged in
  const user = authService.getCurrentUser();

  // 2. Handle Logout
  const handleLogout = () => {
    authService.logout();
    // Redirect to login and refresh to update navbar state
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

          {/* Navigation Links */}
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link to="/" className="hover:text-indigo-200 transition font-medium">
                  Home
                </Link>
              </li>

              {/* 3. Conditional Rendering */}
              {user ? (
                <>
                  {/* SHOW IF LOGGED IN */}
                  <li>
                    <span className="text-indigo-200 text-sm mr-2">Hello, {user.username}</span>
                  </li>
                  <li>
                    <Link
                      to="/create"
                      className="bg-white text-indigo-600 px-4 py-2 rounded-md font-bold hover:bg-indigo-50 transition shadow-sm"
                    >
                      Write Post
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-red-200 hover:text-white transition font-medium border border-transparent hover:border-red-200 px-3 py-1 rounded"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* SHOW IF LOGGED OUT */}
                  <li>
                    <Link to="/login" className="hover:text-indigo-200 transition font-medium">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="bg-indigo-500 px-4 py-2 rounded-md hover:bg-indigo-400 transition font-medium"
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