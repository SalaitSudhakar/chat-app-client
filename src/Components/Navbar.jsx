import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  CircleUserRound,
  LogIn,
  LogOut,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, userData } = useAuthStore();

  const navLinks = [
    { name: "Settings", icon: <Settings />, link: "/settings" },
  ];

  if (!userData) {
    navLinks.push({ name: "Login", icon: <LogIn />, link: "/login" });
  } else {
    /* Push profile data */
    navLinks.push({
      name: "profile",
      icon: () => {
        if (userData?.profilePic) {
          return (
            <img
              src={userData?.profilePic}
              alt="Profile Picture"
              className="border-2 rounded-full size-5 sm:size-6 hover:bg-accent border-base-content"
            />
          );
        } else {
          return <CircleUserRound />;
        }
      },
      link: "/profile",
    });
  }

  return (
    <nav
      className=" border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80 shadow-lg shadow-base-300"
    >
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link
          to={"/"}
          className="flex gap-1 sm:gap-1.5 justify-center items-center font-bold"
        >
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 sm:w-7 sm:h-7 text-base-content/80" />
          </div>

          <h1 className="sm:text-xl">Chat App</h1>
        </Link>

        {/* Right side Links */}
        <ul className="flex gap-1 sm:gap-4 items-center justify-end">
          {navLinks.map((link, index) => (
            <li
              key={index}
              className="flex items-center sm:gap-3 ml-1 sm:ml-2 hover:bg-base-300 border border-transparent hover:border-base-100 rounded-full transition-all duration-300"
            >
              <Link
                to={link.link}
                title={`${link.name} Page`}
                className="flex items-center gap-1 sm:gap-1.5 p-1.5 "
              >
                <>
                  <span className="size-5 sm:size-6 flex items-center justify-center">
                    {typeof link.icon === "function" ? link.icon() : link.icon}
                  </span>
                  {((link.name === "profile" && !userData?.profilePic) ||
                    link.name !== "profile") && (
                    <span className="hidden sm:inline">{link.name}</span>
                  )}
                </>
              </Link>
            </li>
          ))}

          {userData && (
            <>
              {/* Logout button */}
              <button
                className="flex gap-1 items-center cursor-pointer p-2 rounded-full  hover:text-error hover:bg-base-300 transition-all duration-300"
                title="logout"
                onClick={logout}
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
