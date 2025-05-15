import React, { useState, useRef, Fragment } from "react";
import { useChatStore } from "../Store/useChatStore";
import useClickOutside from "./Hooks/useClickOutside";
import { useAuthStore } from "../Store/useAuthStore";
import { Trash2, User } from "lucide-react";

const EmojiReactionDisplay = ({ message }) => {
  const [showReactionContent, setShowReactionContent] = useState(null);
  const [isReactionContentVisible, setIsReactionContentVisible] =
    useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const { removeReaction, getMessages, selectedUser, isRemovingReaction } =
    useChatStore();
  const { userData } = useAuthStore();

  const reactionContentRef = useRef(null);

  useClickOutside(
    reactionContentRef,
    () => {
      setIsReactionContentVisible(false);
      setShowReactionContent(null);
    },
    isReactionContentVisible
  );

  const closeEmojiContainerWithDelay = () => {
    setTimeout(() => {
      setShowReactionContent(null);
      setIsReactionContentVisible(false);
    }, 300);
  };

  const handleUndoReaction = async (e, message) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await removeReaction(message?._id);
    await getMessages(selectedUser?._id);
    closeEmojiContainerWithDelay();
  };

  const toggleReactionClick = (e, reaction, message) => {
    e.preventDefault();
    e.stopPropagation();

    const isSameReaction =
      showReactionContent?.reactionId === reaction?.userId &&
      showReactionContent?.messageId === message?._id;

    if (isSameReaction) {
      closeEmojiContainerWithDelay();
      return;
    }

    setShowReactionContent({
      reactionId: reaction.userId,
      messageId: message._id,
    });
    setIsReactionContentVisible(true);

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const popupWidth = 260;
    const offset = 8;
    const viewportWidth = window.innerWidth;

    const isCurrentUser = message?.senderId === userData?._id;

    // Calculate center
    let left = buttonRect.left + buttonRect.width / 2;

    const leftSideShift = 80;
    const rightSideShift = 60;

    if (isCurrentUser) {
      left -= rightSideShift;
    } else {
      left += leftSideShift;
    }

    // Clamp to prevent overflow
    const minPadding = 20;
    if (left - popupWidth / 2 < minPadding) {
      left = popupWidth / 2 + minPadding;
    } else if (left + popupWidth / 2 > viewportWidth - minPadding) {
      left = viewportWidth - popupWidth / 2 - minPadding;
    }

    setPopupPosition({
      top: buttonRect.top - offset,
      left,
    });
  };

  return (
    <>
      <div
        className={`relative flex pt-1 ${
          message?.senderId === userData?._id
            ? "justify-end pr-2"
            : "justify-start pl-2"
        }`}
      >
        {message?.emojiReactions?.map((reaction) => (
          <Fragment key={`${reaction.userId}-${message._id}`}>
            <button
              onClick={(e) => toggleReactionClick(e, reaction, message)}
              title={"View Reaction"}
              className="p-2 sm:p-2.5 size-6 sm:size-7 rounded-full bg-base-200 cursor-pointer hover:bg-base-200/60 transition-all duration-200 flex items-center justify-center -mr-1"
              aria-label={`Reaction: ${reaction.emoji}`}
            >
              <span>{reaction.emoji}</span>
            </button>

            {isReactionContentVisible &&
              showReactionContent?.reactionId === reaction.userId &&
              showReactionContent?.messageId === message._id && (
                <div
                  ref={reactionContentRef}
                  className="flex items-center bg-base-200 p-2 shadow-md shadow-base-content rounded-xl z-40 gap-4"
                  style={{
                    position: "fixed",
                    top: popupPosition.top,
                    left: popupPosition.left,
                    minWidth: reaction.userId === userData._id ? 280 : 260,
                    transform: "translate(-50%, -100%)",
                    zIndex: 9999,
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  {/* Emoji */}
                  <p className="p-2 rounded-full bg-base-content/20 text-lg">
                    {reaction.emoji}
                  </p>

                  {/* Profile image */}
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full border">
                      <img
                        src={userData.profilePic || "/avatar.png"}
                        alt="profile pic"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* User Info & Remove Button */}
                  <div className="flex flex-col justify-center text-sm">
                    <p className="font-medium flex gap-1 items-center text-base">
                      <User className="size-4" />
                      {reaction.fullname}
                    </p>
                    <button
                      className={`${
                        reaction.userId === userData._id ? "block" : "hidden"
                      } text-xs text-error hover:text-error/80 hover:bg-error/2 p-[2px] rounded-lg flex gap-1 items-center`}
                      onClick={(e) => handleUndoReaction(e, message)}
                    >
                      {isRemovingReaction ? (
                        <span className="loading size-2 loading-spinner"></span>
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                      Remove Reaction
                    </button>
                  </div>
                </div>
              )}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default EmojiReactionDisplay;
