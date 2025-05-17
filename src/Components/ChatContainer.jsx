import { useChatStore } from "../Store/useChatStore";
import { useEffect, useRef, useState, Fragment } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../Store/useAuthStore";
import { formatMessageTime } from "../utils/formatMessageTime";
import avatarImage from "../assets/avatar.png";
import groupMessagesByFormattedDate from "../utils/groupMessagesByFormattedDate";
import Modal from "./Modal";
import CopyDeleteButtons from "./CopyDeleteButtons";
import MessageReaction from "./MessageReaction";
import "../App.css";
import EmojiReactionDisplay from "./EmojiReactionDisplay";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const [emojiReactionClicked, setEmojiReactionClicked] = useState(null);
  const [copyDeleteButtonClicked, setCopyDeleteButtonClicked] = useState(null);

  const { userData } = useAuthStore();

  const messageEndRef = useRef(null);
  const containerRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(false);


useEffect(() => {
  getMessages(selectedUser?._id);
  subscribeToMessages();

  return () => unsubscribeFromMessages();
}, [selectedUser?._id]);


  // Auto scroll to bottom on new message
  useEffect(() => {
    const timeout = setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages.length]);

  let groupedMessages = {};
  if (Array.isArray(messages)) {
    groupedMessages = groupMessagesByFormattedDate(messages);
  }

  const handlePreviewImage = (image) => {
    setSelectedImage(image);
    setPreviewImage(true);
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

      {/* Chat Messages */}
      {messages.length > 0 ? (
        <div
          ref={containerRef}
          className="flex-1 flex-col flex-grow min-h-[50vh] overflow-y-auto p-1 sm:p-4 pb-0 relative"
        >
<div className="flex flex-col">
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
                  className={`chat ${
                    message.senderId === userData._id
                      ? "chat-end"
                      : "chat-start"
                  }`}
                >
                  {/* Profile image */}
                  <div className="chat-image avatar">
                    <div className="size-8 sm:size-10 rounded-full border">
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

                  {/* Message Content */}
                  <div className="chat-bubble flex flex-col relative group hover:bg-base-300/50 max-w-[150px] sm:max-w-1/2 transition-all duration-100">
                    {/* Message Image */}
                    {message.image && (
                      <div title={"View Image"}>
                        <img
                          src={message.image}
                          alt="Attachment"
                          onClick={() => handlePreviewImage(message.image)}
                          className="max-w-[100px] sm:max-w-[150px] rounded-md mb-2 cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Message Text */}
                    {message.text && (
                      <div
                        className={`${
                          message.image
                            ? "absolute -bottom-1 left-0 bg-base-300/90 w-full p-1 text-center group-hover:bg-base-300/80 group-hover:text-white"
                            : ""
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                    )}

                    {/* Copy-delete Buttons */}
                    <CopyDeleteButtons
                      message={message}
                      copyDeleteButtonClicked={copyDeleteButtonClicked}
                      setCopyDeleteButtonClicked={setCopyDeleteButtonClicked}
                      emojiReactionClicked={emojiReactionClicked}
                    />

                    {/* Emoji Reaction */}
                    <MessageReaction
                      message={message}
                      emojiReactionClicked={emojiReactionClicked}
                      setEmojiReactionClicked={setEmojiReactionClicked}
                      CopyDeleteDropdown={copyDeleteButtonClicked}
                    />
                  </div>

                  <EmojiReactionDisplay message={message} />
                </div>
              ))}
            </div>
          ))}
</div>

          {/* Add this dummy div at the end */}
          <div ref={messageEndRef} />
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center text-base-content/70 text-xl capitalize">
          start the conversation...
        </div>
      )}

      {/* Message Input */}
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
