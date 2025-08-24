"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import Loading from "./Loading";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log("user", user);
  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-black via-gray-900 to-black shadow-lg">
      {/* Logo */}
      <div
        className="flex items-center space-x-2 text-xl font-bold text-white cursor-pointer"
        onClick={() => router.push("/")}
      >
        <img
          src="/mutil-ai-logo.png"
          alt="Multi-Agent Logo"
          className="w-10 h-10 rounded-lg shadow-lg border border-gray-200"
        />
        <span>Multi-Agent App</span>
      </div>

      <div ref={menuRef} className="relative">
        {loading ? (
          // Show loading state while /api/check is validating
          <Loading size="sm"/>
        ) : user ? (
          <>
            {/* Profile Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-md transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-semibold">
                {user.name}
              </span>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in z-50">
                <div className="p-4 flex flex-col items-center bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mb-2 shadow">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.outstandingCredits} credits left
                  </p>
                </div>

                <div className="border-t border-gray-200">
                  <button
                    onClick={logout}
                    className="w-full px-4 py-3 text-center text-red-600 font-medium hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // If not logged in
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full shadow-md transition"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
