import { useRef, useEffect } from "react";
import { Copy, Ellipsis, Trash2 } from "lucide-react";

const CopyDeleteButtons = ({
  message,
  isVisible,
  onCopy,
  onDelete,
  onToggle,
  isSender,
}) => {
  const moreContentRef = useRef();

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        moreContentRef.current &&
        !moreContentRef.current.contains(e.target)
      ) {
        onToggle(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onToggle]);
  return (
    <div
      className={`absolute top-0 ${
        isSender ? "-left-15" : "-right-15"
      } p-1 rounded cursor-pointer ${
        isVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      } transition`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 3-dot Button */}
      <Ellipsis onClick={(e) => onToggle(e, message._id)} />

      {/* Copy / Delete Menu */}
      {isVisible && (
        <div
          ref={moreContentRef}
          className={`absolute top-0 ${
            isSender ? "-left-40" : "-right-40"
          } bg-base-300 flex flex-col z-10 min-w-[120px] rounded-lg shadow-lg shadow-base-content`}
        >
          {message.text && (
            <button
              onClick={(e) => onCopy(message.text, e)}
              className="flex gap-1 p-1.5 px-2.5 hover:bg-base-100 rounded-t-lg cursor-pointer"
            >
              <Copy size={18} /> Copy Text
            </button>
          )}

          <button
            onClick={(e) => onDelete(e, message._id)}
            className="flex gap-1 p-1.5 px-2.5 hover:bg-base-100 rounded-b-lg cursor-pointer"
          >
            <Trash2 size={18} /> Delete For Me
          </button>
        </div>
      )}
    </div>
  );
};

export default CopyDeleteButtons;
