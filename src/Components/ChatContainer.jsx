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

  /* Fetch message */
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

  const groupedMessages = groupMessagesByFormattedDate(messages);

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
      <ChatHeader />

      { messages.length > 0 ? (
        <div className="flex-1 overflow-y-auto p-1 sm:p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Header */}
            <div className="text-center my-4 text-gray-500 font-medium">
              {date}
            </div>

            {msgs.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === userData._id ? "chat-end" : "chat-start"
                }`}
                ref={messageEndRef}
              >
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
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col relative">
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

                  {message.text &&
                    (message.image ? (
                      <div className="absolute -bottom-1 left-0 bg-base-300/90 w-full p-1 text-center">
                        <p>{message.text}</p>
                      </div>
                    ) : (
                      <p>{message.text}</p>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      )
    : (
      <div className="h-screen flex items-center justify-center text-base-content/70 text-xl capitalize">start the conversation..</div>
    )}

      <MessageInput />

      {/* Image Preview Modal */}
      <Modal
        title={"Image Preview"}
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
