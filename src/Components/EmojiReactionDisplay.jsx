import React, { useState, useRef, Fragment } from 'react';
import { useChatStore } from '../Store/useChatStore';
import useClickOutside from './Hooks/useClickOutside'; // Assuming this is your custom hook
import { useAuthStore } from '../Store/useAuthStore';

const EmojiReactionDisplay = ({ message }) => {
  // State to track which reaction popup is shown and its position on screen
  const [showReactionContent, setShowReactionContent] = useState(null);
  const [isReactionContentVisible, setIsReactionContentVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const { removeReaction, getMessages, selectedUser } = useChatStore();
  const { userData } = useAuthStore();

  // Ref for the popup to detect outside clicks
  const reactionContentRef = useRef(null);

  // Hook to close popup when clicking outside
  useClickOutside(
    reactionContentRef,
    () => {
      setIsReactionContentVisible(false);
      setShowReactionContent(null);
    },
    isReactionContentVisible
  );

  // Undo/remove reaction handler
  const handleUndoReaction = async (e, message) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await removeReaction(message?._id);
    await getMessages(selectedUser?._id);

    setShowReactionContent(null);
    setIsReactionContentVisible(false);
  };

  // Handle reaction emoji click to toggle popup
  const toggleReactionClick = (e, reaction, message) => {
    e.preventDefault();
    e.stopPropagation();

    const isSameReaction =
      showReactionContent?.reactionId === reaction?.userId &&
      showReactionContent?.messageId === message?._id;

    if (isSameReaction) {
      // Close if clicking same reaction
      setIsReactionContentVisible(false);
      setShowReactionContent(null);
      return;
    }

    // Show popup for this reaction
    setShowReactionContent({ reactionId: reaction.userId, messageId: message._id });
    setIsReactionContentVisible(true);

    // Calculate and set popup position relative to clicked button
     const buttonRect = e.currentTarget.getBoundingClientRect();

  const popupWidth = 260; // Same as minWidth of popup div
  const offset = 8; // vertical offset above button

  const viewportWidth = window.innerWidth;

  // Calculate the ideal left position (center popup on button)
  let left = buttonRect.left + buttonRect.width / 2;

  // Clamp left so popup never goes off-screen horizontally
  const minPadding = 8; // px from viewport edge
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
        className={`relative flex pt-1.5 ${
          message?.senderId === userData?._id ? 'justify-end pr-2' : 'justify-start pl-2'
        }`}
      >
        {message?.emojiReactions?.map((reaction) => (
          <Fragment key={`${reaction.userId}-${message._id}`}>
            <button
              onClick={(e) => toggleReactionClick(e, reaction, message)}
              className="p-2 sm:p-2.5 size-6 sm:size-7 rounded-full bg-base-200 cursor-pointer hover:bg-base-200/60 transition-all duration-200 flex items-center justify-center -mr-1"
              aria-label={`Reaction: ${reaction.emoji}`}
            >
              <span>{reaction.emoji}</span>
            </button>

            {/* Reaction Popup */}
            {isReactionContentVisible &&
              showReactionContent?.reactionId === reaction.userId &&
              showReactionContent?.messageId === message._id && (
                <div
                  ref={reactionContentRef}
                  className='flex items-center gap-1 bg-base-200 p-2 shadow-md shadow-base-content rounded-xl z-40'
                  // Use fixed positioning to float near the button clicked
                  style={{
                    position: 'fixed',
                    top: popupPosition.top,
                    left: popupPosition.left,
                    transform: 'translate(-50%, -100%)', // center horizontally, above button
                    minWidth: 260,
                    display: 'flex',
                    zIndex: 9999,
                    alignItems: 'center',
                    gap: '1.25rem',
                    animation: 'fadeIn 0.3s ease',
                  }}
                >
                  {/* Emoji Display */}
                  <p className="p-1 sm:p-2 rounded-full bg-base-content/20 sm:text-lg">
                    {reaction.emoji}
                  </p>

                  {/* User Profile Image */}
                  <div className="chat-image avatar">
                    <div className="size-8 sm:size-10 rounded-full border">
                      <img
                        src={userData.profilePic || '/avatar.png'}
                        alt="profile pic"
                      />
                    </div>
                  </div>

                  {/* User Info & Remove Button */}
                  <div className="flex flex-col items-center text-sm">
                    <p className="font-medium">{reaction.fullname}</p>
                    <button
                      className={`${reaction.userId === userData._id ? 'block' : 'hidden' } text-xs text-error hover:underline hover:text-error/80`}
                      onClick={(e) => handleUndoReaction(e, message)}
                    >
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
