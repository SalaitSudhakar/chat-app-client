import { useEffect, useRef, useState } from "react";
import { Copy, Ellipsis, Trash2 } from "lucide-react";
import useClickOutside from "./Hooks/useClickOutside";
import toast from "react-hot-toast";
import { useChatStore } from "../Store/useChatStore";
import { useAuthStore } from "../Store/useAuthStore";

const CopyDeleteButtons = ({
  message,
  copyDeleteButtonClicked,
  setCopyDeleteButtonClicked,
  emojiReactionClicked,
}) => {
  const copyDeleteDropdownRef = useRef();
  const { deleteMessageForMe, isDeleting } = useChatStore();
  const { userData } = useAuthStore();

  const [isCopying, setIsCopying] = useState(false);

  const messageId = message?._id;
  const isSender = message?.senderId === userData?._id;
  const isVisible = copyDeleteButtonClicked?.messageId === messageId;
  const isEmojiReactionActive = emojiReactionClicked?.messageId === messageId;

  const handleEvent = (event) => {
    if (!event) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const closeMenuWithDelay = () => {
    setTimeout(() => setCopyDeleteButtonClicked({}), 500);
  };

  const handleCopyMessage = async (text, event) => {
    handleEvent(event);
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message Copied");
      closeMenuWithDelay();
    } catch (error) {
      toast.error(`Failed to copy text: ${error}`);
    } finally {
      setIsCopying(false);
    }
  };

  const onToggle = (event, id) => {
    handleEvent(event);
    setCopyDeleteButtonClicked((prev) =>
      prev?.messageId === id ? null : { messageId: id }
    );
  };

  const handleDeleteForMe = async (event, id) => {
    handleEvent(event);
    if (id) {
      await deleteMessageForMe(id);
    }
    closeMenuWithDelay();
  };

  useEffect(() => {
    if (!isVisible) {
      setCopyDeleteButtonClicked(false);
    }
  }, [isVisible, setCopyDeleteButtonClicked]);

  // Close the menu if clicked outside
  useClickOutside(copyDeleteDropdownRef, onToggle, isVisible);

  const positionClass = isSender
    ? "-left-10 sm:-left-15"
    : "-right-10 sm:-right-15";
  const dropdownPositionClass = isSender
    ? "-left-10 sm:-left-40"
    : "-right-10 sm:-right-40";

  // Always show the three dots icon when active, or on hover
  const visibilityClass =
    isVisible || isEmojiReactionActive
      ? "opacity-100"
      : "opacity-0 group-hover:opacity-100";

  return (
    <div
      className={`absolute top-0 ${positionClass} p-1 rounded cursor-pointer ${visibilityClass} transition-opacity duration-500`}
      onClick={(e) => e.stopPropagation()}
    >
      <Ellipsis
        size={35}
        onClick={(e) => onToggle(e, messageId)}
        className={`p-1.5 hover:bg-base-300 rounded-full ${
          isVisible ? "opacity-100" : "opacity-60"
        }`}
      />

      {isVisible && (
        <div
          ref={copyDeleteDropdownRef}
          className={`absolute top-0 sm:top-1 ${dropdownPositionClass} bg-base-300 flex flex-col z-10 min-w-[120px] rounded-lg shadow-lg shadow-base-content`}
        >
          {message.text && (
            <button
              onClick={(e) => handleCopyMessage(message.text, e)}
              className="flex gap-1 p-1.5 px-2 sm:px-2.5 hover:bg-base-100 rounded-t-lg cursor-pointer"
            >
              {isCopying ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <Copy size={18} />
              )}{" "}
              Copy Text
            </button>
          )}

          <button
            onClick={(e) => handleDeleteForMe(e, messageId)}
            className="flex gap-1 p-1.5 px-2 sm:px-2.5 hover:bg-base-100 rounded-b-lg cursor-pointer"
          >
            {isDeleting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Trash2 size={18} />
            )}{" "}
            Delete For Me
          </button>
        </div>
      )}
    </div>
  );
};

export default CopyDeleteButtons;
