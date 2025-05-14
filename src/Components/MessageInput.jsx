import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../Store/useChatStore";
import { Image, Send, Smile, X } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import useClickOutside from "./Hooks/useClickOutside";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isMessageSending } = useChatStore();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const emojiPickerRef = useRef(null);
  const [pickerSize, setPickerSize] = useState({ width: 310, height: 350 });

  // Function to calculate emoji picker dimensions based on screen size
  const calculatePickerSize = () => {
    const width = window.innerWidth;

    if (width < 640) {
      // mobile
      setPickerSize({ width: Math.min(280, width - 20) });
    } else if (width < 1024) {
      // tablet
      setPickerSize({ width: 310 });
    } else {
      // desktop
      setPickerSize({ width: 350 });
    }
  };

  // Calculate size on mount and window resize
  useEffect(() => {
    calculatePickerSize();

    const handleResize = () => {
      calculatePickerSize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    const messageData = new FormData();

    if (text) {
      messageData.append("text", text.trim());
    }
    if (image) {
      messageData.append("image", image);
    }
    try {
      const success = await sendMessage(messageData);

      if (success) {
        // Clear form
        setText("");
        setImagePreview(null);
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to send message:", error);
    }
  };

  /* Get Theme */
  const theme = localStorage.getItem("chat-theme");

  const getTheme = () => {
    if (theme === "dark") return "dark";
    if (theme === "light") return "light";
    return "auto";
  };

  /* Handle emoji click */
  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    setIsEmojiPickerOpen(false);
  };

  /* close the emoji picker when clicked outside */
  useClickOutside(emojiPickerRef, () => setIsEmojiPickerOpen(false), isEmojiPickerOpen)

  // Adjust emoji picker position based on available space
  const getEmojiPickerPosition = () => {
    // Default position above the input
    return `absolute left-0 bottom-full z-20 rounded-xl shadow-lg shadow-base-content/60  transition-all duration-300 ease-in-out transform
    ${
      isEmojiPickerOpen
      ? "opacity-100 translate-y-0 scale-100"
      : "opacity-0 translate-y-4 scale-95"
    }`;
  };

  return (
    <div className="p-2 sm:p-4 pb-3 pt-0 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="w-full flex items-center gap-2"
      >
        <div className="relative flex-1 flex gap-2">
          <input
            type="text"
            aria-label="Text Message Input"
            className="w-full input input-bordered rounded-lg input-md sm:input-lg border-0 bg-base-content/10 py-1.5 sm:py-2"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="image upload input"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            disabled={isMessageSending}
            className={`absolute right-2 cursor-pointer top-2 text-primary hover:bg-primary/20 p-0.5 sm:p-1 transition-all duration-200 flex z-10 rounded-full
                     ${imagePreview ? "text-accent-content" : "text-accent"}
                     ${isMessageSending && "text-"}
                     `}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload Image"
          >
            <Image className="size-5 sm:size-6" />
          </button>

          {/* Emoji picker icon*/}
          <button
            disabled={isMessageSending}
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className={`absolute right-8 sm:right-10 top-2 cursor-pointer text-primary hover:bg-primary/20 p-0.5 sm:p-1 z-10 transition-all duration-200  rounded-full ${
              isMessageSending && "text-gray-400"
            }`}
            aria-label="Open emoji picker"
            type="button"
          >
            <Smile className="size-5 sm:size-6" />
          </button>

          {/* Emoji picker component */}
          {isEmojiPickerOpen && (
            <div ref={emojiPickerRef} className={getEmojiPickerPosition()}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                open={isEmojiPickerOpen}
                theme={getTheme()}
                emojiStyle="apple"
                skinTonesDisabled={true}
                searchDisabled={false}
                lazyLoadEmojis={true}
                previewConfig={{ showPreview: true }}
                width={pickerSize.width}
                height={"400px"}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`btn btn-sm btn-circle btn-primary p-1 `}
          disabled={(!text.trim() && !imagePreview) || isMessageSending}
          aria-label="send message"
        >
          {isMessageSending ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <Send className="size-4 sm:size-5" />
          )}
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
