import { useChatStore } from "../Store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../Store/useAuthStore";
import { formatMessageTime } from "../utils/formatMessageTime";
import avatarImage from "../assets/avatar.png";
import groupMessagesByFormattedDate from "../utils/groupMessagesByFormattedDate";
import Modal from "./Modal";
import EmojiPicker from "emoji-picker-react";
import { Copy, Ellipsis, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { userData } = useAuthStore();
  const messageEndRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState({});
  const moreContentRef = useRef();

  useEffect(() => {
    getMessages(selectedUser?._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // Smooth scroll animation
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleCloseMoreContentDiv = (e) => {
      if (
        moreContentRef.current &&
        !moreContentRef.current.contains(e.target)
      ) {
        setHoveredMessage({});
      }
    };

    document.addEventListener("mousedown", handleCloseMoreContentDiv);

    return () =>
      document.removeEventListener("mousedown", handleCloseMoreContentDiv);
  }, []);

  const groupedMessages = groupMessagesByFormattedDate(messages);

  const handlePreviewImage = (image) => {
    setSelectedImage(image);
    setPreviewImage(true);
  };

  const handleCopyMessage = async (text, event) => {
    console.log("Message is Copying");

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message Copied");

      setTimeout(() => {
        setHoveredMessage({});
      }, 500);
    } catch (error) {
      toast.error("Failed to copy text: ", error);
    }
  };

  const handleMoreBtnClick = (event, id) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setHoveredMessage((prev) => ({ ...prev, messageId: id }));
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat Header */}
      <ChatHeader />

      {/* Chat Container */}
      {messages.length > 0 ? (
        <div className="flex-1 flex-col flex-grow min-h-[50vh] overflow-y-auto p-1 sm:p-4 pb-0 relative">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="text-center my-4 text-gray-500 font-medium">
                {date}
              </div>

              {/* Messages */}
              {msgs.map((message) => (
                <div
                  key={message._id}
                  className={`chat group-hover:bg-primary/5 ${
                    message.senderId === userData._id
                      ? "chat-end"
                      : "chat-start"
                  }`}
                  ref={messageEndRef}
                >
                  {/* Profile image */}
                  <div className="chat-image avatar">
                    <div className="size-10 rounded-full border">
                      <img
                        src={
                          message.senderId === userData._id
                            ? userData.profilePic || avatarImage
                            : selectedUser.profilePic || avatarImage
                        }
                        alt="profile pic"
                      />
                    </div>
                  </div>

                  {/* Message sent time */}
                  <div className="chat-header mb-1">
                    <time className="text-xs opacity-50 ml-1">
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>

                  {/* Message - Image */}
                  <div className="chat-bubble flex flex-col relative group group-hover:bg-base-300/10 transiton-all duration-200">
                    {message.image && (
                      <div>
                        <img
                          src={message.image}
                          alt="Attachment"
                          onClick={() => handlePreviewImage(message.image)}
                          className="max-w-[100px] sm:max-w-[150px] rounded-md mb-2"
                        />
                      </div>
                    )}

                    {/* Message - Text */}
                    {message.text && (
                      <div
                        className={`${
                          message.image
                            ? "absolute -bottom-1 left-0 bg-base-300/90 w-full p-1 text-center"
                            : ""
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                    )}

                    {/* Copy-delete 3 dot button */}
                    <div
                      ref={moreContentRef}
                      className={`absolute top-0 ${
                        message.senderId === userData._id
                          ? "-left-15"
                          : "-right-15"
                      } p-1 rounded cursor-pointer ${
                        hoveredMessage?.messageId === message._id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      } transition`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* 3 dot button */}
                      <Ellipsis
                        onClick={(event) =>
                          handleMoreBtnClick(event, message._id)
                        }
                      />

                      {/* Copy - Delete buttons */}
                      {hoveredMessage?.messageId === message._id && (
                        <div
                          className={`absolute top-0 ${
                            message.senderId === userData._id
                              ? "-left-40"
                              : "-right-40"
                          } bg-base-300 flex flex-col z-10 min-w-[120px] rounded-lg shadow-lg shadow-base-content`}
                        >
                          {/* Copy button show only for text */}
                          {message.text && (
                            <button
                              onClick={(event) =>
                                handleCopyMessage(message.text, event)
                              }
                              className="flex gap-1 p-1.5 px-2.5 hover:bg-base-100 rounded-t-lg cursor-pointer"
                            >
                              <Copy size={18} /> Copy Text
                            </button>
                          )}

                          <button className="flex gap-1 p-1.5 px-2.5 hover:bg-base-100 rounded-b-lg cursor-pointer">
                            <Trash2 size={18} /> Delete For Me
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center text-base-content/70 text-xl capitalize">
          start the conversation...
        </div>
      )}

      <MessageInput />

      {/* Image Preview Modal */}
      <Modal
        title="Image Preview"
        closeModal={() => {
          setPreviewImage(false);
          setSelectedImage(null);
        }}
        isModalOpen={previewImage}
      >
        <div className="max-h-[80vh] w-full overflow-auto flex items-center justify-center">
          <img
            src={selectedImage}
            alt="attachment Image Preview"
            className="max-h-[70vh] w-auto rounded-md shadow"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ChatContainer;
