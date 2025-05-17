import { create } from "zustand";
import { toast } from "react-hot-toast";
import { api } from "./../Config/axiosConfig";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isMessageSending: false,
  isReacting: false,
  isRemovingReaction: false,
  isClearingChat: false,
  isDeleting: false,

  getUsers: async () => {
    set({ isUserLoading: true });

    try {
      const response = await api.get("user/get-users");

      const { users } = response.data;
      set({ users: users });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Fetching Users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (id) => {
    set({ isMessageLoading: true });
    try {
      const response = await api.get(`/message/${id}`);
      const { messages } = response.data;
      set({ messages: messages });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Fetching Messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    set({ isMessageSending: true });
    try {
      const response = await api.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      const { newMessage } = response.data;
      set({ messages: [...messages, newMessage] });
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Sending Message");
      return false;
    } finally {
      set({ isMessageSending: false });
    }
  },

  clearChat: async (id) => {
    if (!get().messages || get().messages.length <= 0) {
      toast.error("There Chat is already empty");
    }
    set({ isClearingChat: true });
    try {
      const response = await api.patch(`/message/clear-chat/${id}`);

      toast.success(response.data.message || "Chat Cleared");
      set({ messages: [] });
    } catch (error) {
      toast.error(error || "Error Clearing Chat");
    } finally {
      set({ isClearingChat: false });
    }
  },

  deleteMessageForMe: async (messageId) => {
    set({ isDeleting: true });
    try {
      const response = await api.patch(`/message/delete-for-me/${messageId}`);

      toast.success(response.data.message || "Message Delete Successfully");
      set({
        messages: get().messages.filter((message) => message._id !== messageId),
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error Deleting the message"
      );
    } finally {
      set({ isDeleting: false });
    }
  },

  addReaction: async (messageId, emoji) => {
    set({ isReacting: true }); 

    try {
      const response = await api.patch(`/message/add-reaction/${messageId}`, {
        emoji,
      });

      const { message, messageData } = response.data;

      toast.success(message || "Reaction added successfully");
      // Update the message with new reaction
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, emojiReactions: messageData.emojiReactions }
            : msg
        ),
      }));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error Reacting to the message"
      );
    } finally {
      set({ isReacting: false });
    }
  },

  removeReaction: async (messageId) => {
    set({ isRemovingReaction: true });

    const userId = useAuthStore?.getState().userData?._id;

    // ✅ Optimistically remove the user's reaction
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              emojiReactions:
                msg.emojiReactions?.filter(
                  (reaction) => reaction.user !== userId
                ) || [],
            }
          : msg
      ),
    }));

    try {
      const response = await api.delete(
        `/message/delete-reaction/${messageId}`
      );
      const { message, messageData } = response.data;

      toast.success(message || "Reaction removed successfully");

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, emojiReactions: messageData.emojiReactions }
            : msg
        ),
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error removing reaction");
    } finally {
      set({ isRemovingReaction: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState()?.socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    // ✅ Listen for reaction added
    socket.on("reactionAdded", (updatedMessage) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === updatedMessage._id
            ? { ...msg, emojiReactions: updatedMessage.emojiReactions }
            : msg
        ),
      }));
    });

    // ✅ Listen for reaction removed
    socket.on("reactionRemoved", (updatedMessage) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === updatedMessage._id
            ? { ...msg, emojiReactions: updatedMessage.emojiReactions }
            : msg
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState()?.socket;
    socket.off("newMessage");
    socket.off("reactionAdded");
    socket.off("reactionRemoved");
  },
}));
