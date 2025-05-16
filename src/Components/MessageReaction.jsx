import { Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../Store/useAuthStore";
import useClickOutside from "./Hooks/useClickOutside";
import { useChatStore } from "../Store/useChatStore";

const MessageReaction = ({
  message,
  emojiReactionClicked,
  setEmojiReactionClicked,
  CopyDeleteDropdown,
}) => {
  const { userData } = useAuthStore();
  const emojiDropdownRef = useRef();

  const [isCommonEmojisVisible, setIsCommonEmojisVisible] = useState(false);

  const messageId = message?._id;
  const isVisible = emojiReactionClicked?.messageId === messageId;
  const isThreeDotActive = CopyDeleteDropdown?.messageId === messageId;
  const isSender = message.senderId === userData._id;

  const commonEmojis = ["👍", "😂", "🥲", "👏", "🔥", "💖"];

  const { addReaction, getMessages, selectedUser } = useChatStore();

  useEffect(() => {
    if (isVisible) {
      setIsCommonEmojisVisible(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !isCommonEmojisVisible) {
      setEmojiReactionClicked(false);
    }
  }, [isVisible, isCommonEmojisVisible, setEmojiReactionClicked]);

  const handleEvent = (event) => {
    if (!event) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const onToggle = (event, id) => {
    handleEvent(event);
    setEmojiReactionClicked((prev) =>
      prev?.messageId === id ? null : { messageId: id }
    );
  };

  const handleEmojiSelect = async (emoji) => {
    await addReaction(messageId, emoji);
    setEmojiReactionClicked(null);

     // Fetch messages after adding reaction
    if (selectedUser?._id) {
      await getMessages(selectedUser._id);
    }
  };

  useClickOutside(
    emojiDropdownRef,
    () => setIsCommonEmojisVisible(false),
    isCommonEmojisVisible
  );

  const containerPositionClass = isSender
    ? "-left-18 sm:-left-23"
    : "-right-18 sm:-right-23";

  const dropdownPositionClass = isSender
    ? "-left-25 sm:-left-40"
    : "-right-25 sm:-right-40";

  const visibilityClass =
    isVisible || isThreeDotActive || isCommonEmojisVisible
      ? "opacity-100 pointer-events-auto"
      : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto";

  return (
    <div
      className={`absolute top-0 ${containerPositionClass} p-1 rounded cursor-pointer  ${visibilityClass} transition-all duration-500`}
    >
      <Smile
        size={35}
        onClick={(e) => onToggle(e, messageId)}
        className="p-2 hover:bg-base-300 rounded-full"
      />

      {/* Common Emojis */}
      {isCommonEmojisVisible && (
        <div
          className={`absolute top-1 ${dropdownPositionClass} flex z-10 p-2 bg-base-200 rounded-lg shadow-lg shadow-base-content`}
        >
          {commonEmojis.map((emoji) => (
            <div
              key={emoji}
              ref={emojiDropdownRef}
              onClick={() => {
                setIsCommonEmojisVisible(false);
                handleEmojiSelect(emoji);
              }}
              className="flex text-xl cursor-pointer  p-1 rounded-full"
            >
              {emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageReaction;
