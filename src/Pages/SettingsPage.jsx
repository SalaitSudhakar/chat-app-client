import React from "react";
import { Send } from "lucide-react";
import { THEMES } from "../constants/themes";
import { themeIconMap } from "../constants/iconMap";
import { useThemeStore } from "../Store/useThemeStore";
import avatarImage from "../assets/avatar.png";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Machan, eppo varra? 🕒", isSent: false },
  { id: 2, content: "Innum 10 mins la vanthurren🛵", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  const themesWithIcons = THEMES.sort().map((themeId) => ({
    id: themeId,
    name: themeId.charAt(0).toUpperCase() + themeId.slice(1),
    icon: themeIconMap[themeId] || null,
  }));

  return (
    <section className="flex justify-center items-start min-h-screen pb-10 pt-5 px-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>

        <div className="grid grid-cols-1 gap-5">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Theme Selection */}
            <div className="bg-base-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Theme</h2>

              {/* Theme */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {themesWithIcons.map((t) => (
                  <button
                    key={t.id}
                    className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-pointer 
                 transition-colors duration-150 ${
                   theme === t.id
                     ? "bg-neutral"
                     : "bg-base-200 hover:bg-base-content/10"
                 }
              `}
                    onClick={() => setTheme(t.id)}
                  >
                    <div
                      className="relative h-8 w-full rounded-md overflow-hidden"
                      data-theme={t.id}
                    >
                      <div className="absolute inset-0 flex gap-px p-1">
                        <div className="rounded flex-1 bg-primary"></div>
                        <div className="rounded flex-1 bg-secondary"></div>
                        <div className="rounded flex-1 bg-accent"></div>
                        <div className="rounded flex-1 bg-neutral"></div>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] ${
                        theme === t.id && "text-neutral-content"
                      } font-medium truncate w-full text-center`}
                    >
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat UI Preview */}
            <div className="bg-base-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Chat Preview</h2>

              <div className="border border-base-300 rounded-lg overflow-hidden shadow">
                <div className="bg-base-100 flex items-center justify-between p-4 border-b border-base-300">
                  <div className="flex items-center space-x-3">
                    <div className="avatar flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full  flex items-center justify-center ">
                        <img src={avatarImage} alt="avatar profile image" />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">John Doe</div>
                      <div className="text-xs opacity-70">Online</div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex  ${
                        message.isSent ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                          flex flex-col max-w-[80%] rounded-xl p-3 shadow-sm 
                          ${
                            message.isSent
                              ? "bg-primary text-primary-content"
                              : "bg-base-200"
                          }
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5 
                            ${
                              message.isSent
                                ? "text-primary-content/70"
                                : "text-base-content/70"
                            }
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-base-100 p-3 border-t border-base-300">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="input input-bordered w-full"
                    />
                    <button className="btn btn-circle btn-primary">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;
