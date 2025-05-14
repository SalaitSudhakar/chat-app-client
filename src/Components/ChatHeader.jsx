import { EllipsisVertical, Trash2, X } from "lucide-react";
import { useAuthStore } from "../Store/useAuthStore";
import { useChatStore } from "../Store/useChatStore";
import avatarImage from "../assets/avatar.png";
import { useRef, useState } from "react";
import useClickOutside from './Hooks/useClickOutside';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, clearChat } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [isMoreContentOpen, setIsMoreContentOpen] = useState(false);

  const moreContentDropdownRef = useRef();

  /* close click outside hook */
  useClickOutside(moreContentDropdownRef, () => setIsMoreContentOpen(false), isMoreContentOpen)

  const btnStyle =
    "cursor-pointer px-2 py-1.5 w-full hover:bg-base-content/10 transition-all duration-150";

  const handleClearChat = async () => {
    if (!selectedUser) return;
    await clearChat(selectedUser._id);

    setIsMoreContentOpen(false);
  };

  return (
    <div className="p-2.5 shadow-sm shadow-base-content bg-primary/10 backdrop-blur-sm z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative border-2 border-base-content">
              <img
                src={selectedUser?.profilePic || avatarImage}
                alt={selectedUser?.fullname}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div ref={moreContentDropdownRef} className="relative">
          <button
            onClick={() => setIsMoreContentOpen(true)}
            className="p-1 hover:bg-base-content/10 rounded-full transition-all duration-150 cursor-pointer"
          >
            <EllipsisVertical />
          </button>

          {isMoreContentOpen && (
            <div
              className={`absolute -left-25 top-10 z-50 bg-base-300 rounded-lg shadow-md shadow-base-content/60 min-w-[120px]
              ${
                isMoreContentOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }
              transition-all duration-300 ease-in-out`}
            >
              <button onClick={handleClearChat} className={btnStyle}>
                <div className="flex items-center gap-1.5 ">
                  <Trash2 className="text-base-content/60 size-5" />
                  <span>Clear Chat</span>
                </div>
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className={btnStyle}
              >
                <div className="flex items-center gap-1.5 ">
                  <X className="text-base-content/60 size-5" />
                  <span>Close Chat</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
