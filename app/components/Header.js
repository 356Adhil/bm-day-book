"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  LogInIcon,
} from "lucide-react";

export default function BottomNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setActiveTab(window.location.pathname);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleNavigation = (path) => {
    setActiveTab(path);
    router.push(path);
  };

  const NavItem = ({ icon: Icon, label, onClick, path }) => {
    const isActive = path === activeTab;

    return (
      <button
        onClick={onClick}
        className={`group relative flex flex-col items-center justify-center w-20 py-3
                   transition-all duration-300 ease-in-out bg-white`}
      >
        {/* Active Tab Indicator */}
        {/* {isActive && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
          </div>
        )} */}

        {/* Icon Container with Floating Effect */}
        <div
          className={`relative transition-all duration-300 ease-in-out
                        ${
                          isActive
                            ? "transform -translate-y-2"
                            : "group-hover:-translate-y-1"
                        }`}
        >
          {/* Background Glow Effect */}
          {isActive && (
            <div className="absolute inset-0 bg-blue-400 opacity-20 blur-xl rounded-full" />
          )}

          {/* Icon Circle */}
          <div
            className={`relative flex items-center justify-center w-12 h-12 rounded-2xl
                          transition-all duration-300 transform
                          ${
                            isActive
                              ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-200"
                              : "bg-gray-50 text-gray-500 group-hover:bg-gray-100"
                          }`}
          >
            <Icon
              className={`w-5 h-5 transition-all duration-300
                            ${
                              isActive
                                ? "stroke-2"
                                : "stroke-1 group-hover:stroke-2"
                            }`}
            />
          </div>
        </div>

        {/* Label */}
        <span
          className={`text-xs mt-2 font-medium transition-colors duration-300
                         ${
                           isActive
                             ? "text-blue-600"
                             : "text-gray-500 group-hover:text-gray-700"
                         }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Spacer */}
      <div className="h-24" />

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 pb-5 left-0 right-0 z-50">
        {/* Blur Background */}
        <div className="absolute inset-0 bg-white backdrop-blur-lg" />
        {/* Main Navigation Container */}
        <div className="relative max-w-lg mx-auto px-4 h-20">
          {/* Navigation Items Container */}
          <div className="flex items-center justify-around h-full">
            <NavItem
              icon={HomeIcon}
              label="Home"
              onClick={() => handleNavigation("/")}
              path="/"
            />

            <NavItem
              icon={LayoutDashboardIcon}
              label="Dashboard"
              onClick={() => handleNavigation("/dashboard")}
              path="/dashboard"
            />

            {isLoggedIn ? (
              <NavItem
                icon={LogOutIcon}
                label="Logout"
                onClick={handleLogout}
                path="/logout"
              />
            ) : (
              <NavItem
                icon={LogInIcon}
                label="Login"
                onClick={() => handleNavigation("/login")}
                path="/login"
              />
            )}
          </div>
        </div>

        {/* Safe Area Padding for iOS */}
        <div className="h-safe-area-inset-bottom bg-white bg-opacity-80" />
      </nav>
    </>
  );
}
