import { useEffect, useState } from "react";
import { useChatStore } from "../Store/useChatStore";
import { useAuthStore } from "../Store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, SquareChevronLeft } from "lucide-react";
import { useSidebarStore } from "../Store/useSidebarStore";
import avatarImage from '../assets/avatar.png'

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebarStore();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* Overlay - only visible on small screens and when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 w-full h-full bg-base-100/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed top-0 left-0 w-3/4 sm:w-2/3 h-full z-50 transition-transform duration-300
          bg-base-100 border-r border-base-300 flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:w-72 lg:flex
        `}
      >
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1">
              <Users className="size-6" />
              <span className="font-medium hidden lg:block">Contacts</span>
            </div>
            {/* Hide close icon on large screens */}
            <SquareChevronLeft
              onClick={() => setIsSidebarOpen(false)}
              className="cursor-pointer lg:hidden"
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">
              ({onlineUsers.length - 1} online)
            </span>
          </div>
        </div>

        <div className="overflow-y-auto py-3">
          {filteredUsers.map((user) => (
            <button
              key={user?._id}
              onClick={() => {
                setSelectedUser(user);
                setIsSidebarOpen(false);
              }}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?._id === user?._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              <div className="relative pl-4 lg:px-0 lg:mx-0">
                <img
                  src={user?.profilePic || avatarImage}
                  alt={user?.fullname}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user?._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="text-left min-w-0">
                <div className="font-medium truncate">{user.fullname}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No online users
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
