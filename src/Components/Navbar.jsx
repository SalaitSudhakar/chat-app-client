import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  ChevronDown,
  CircleUserRound,
  LogIn,
  LogOut,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { THEMES } from "../constants/themes";
import { themeIconMap } from "../constants/iconMap";
import { useThemeStore } from "../Store/useThemeStore";
import { Check } from "lucide-react";

const Navbar = () => {
  const { logout, userData } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { theme, setTheme } = useThemeStore();

  const themesWithIcons = THEMES.map((themeId) => ({
    id: themeId,
    name: themeId.charAt(0).toUpperCase() + themeId.slice(1),
    icon: themeIconMap[themeId] || null,
  }));

  const CurrentThemeIcon = themeIconMap[theme];
  console.log(CurrentThemeIcon);

  const iconSize = "size-5 sm:size-6";
  const navLinks = [
    {
      name: "Settings",
      icon: <Settings className={`${iconSize}`} />,
      link: "/settings",
    },
  ];

  if (!userData) {
    navLinks.push({
      name: "Login",
      icon: <LogIn className={`${iconSize}`} />,
      link: "/login",
    });
  } else {
    /* Push profile data */
    navLinks.push({
      name: "Profile",
      icon: () => {
        if (userData?.profilePic) {
          return (
            <div className="avatar">
              <div className="w-6 sm:w-7 rounded-full border-2 border-base-content">
                <img src={userData?.profilePic} alt="Profile Picture" />
              </div>
            </div>
          );
        } else {
          return <CircleUserRound className={`${iconSize}`} />;
        }
      },
      link: "/profile",
    });
  }

  return (
    <nav
      className=" border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80 shadow-md shadow-base-content/70"
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
                  <span className="flex items-center justify-center">
                    {typeof link.icon === "function" ? link.icon() : link.icon}
                  </span>

                  <span className="hidden sm:inline">{link.name}</span>
                </>
              </Link>
            </li>
          ))}

          <div className="relative">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn p-1 sm:p-2 sm:m-1 hover:text-base-content hover:bg-base-200 transition-colors duration-200"
              >
                <div className="flex items-center gap-1 sm:gap-2 ">
                  {CurrentThemeIcon && (
                    <CurrentThemeIcon className="size-5 sm:size-6" />
                  )}
                  <span className="capitalize hidden sm:inline">{theme}</span>
                </div>
                <ChevronDown className="size-5 sm:size-6" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl max-h-60 overflow-y-auto"
              >
                {themesWithIcons.map((themeOption) => {
                  const Icon = themeOption.icon;
                  return (
                    <li
                      key={themeOption.id}
                      className="px-3 py-2 hover:bg-accent/50 cursor-pointer flex items-center justify-between"
                      onClick={(e) => {
                        if (dropdownOpen) {
                          e.stopPropagation();
                        }
                        setTheme(themeOption.id);
                        setDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {Icon ? (
                          <Icon size={18} />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-primary"></div>
                        )}
                        {themeOption.name}
                      </div>
                      {theme === themeOption.id && <Check size={16} />}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

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
