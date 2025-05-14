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
    try {
      const response = await api.patch(`/message/clear-chat/${id}`);

      toast.success(response.data.message || "Chat Cleared");
      set({ messages: [] });
    } catch (error) {
      toast.error(error || "Error Clearing Chat");
    }
  },

  deleteMessageForMe: async (messageId) => {
    try {
      const response = await api.patch(`/message/delete-for-me/${messageId}`);

      toast.success(response.data.message || "Message Delete Successfully");
      set({
        messages: get().messages.filter((message) => message._id !== messageId),
      });
    } catch (error) {
      toast.error(error || "Error Deleting the message");
    }
  },

  addReaction: async (messageId) => {
    try {
      const response = await api.patch(`/message/add-reaction/${messageId}`);

      const { message, messageData } = response.data;

      toast.success(message || "Reaction added successfully");
      set({ messages: messageData });
    } catch (error) {
      toast.error(error || "Error Reacting to the message");
    }
  },

  removeReaction: async (messageId) => {
    try {
      const response = await api.delete(`/message/delete-reaction/${messageId}`);

      const { message, messageData } = response.data;

      toast.success(message || "Reaction Deleted successfully");
      set({ messages: messageData });
    } catch (error) {
      toast.error(error || "Error Reacting to the message");
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
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState()?.socket;
    socket.off("newMessage");
  },
}));
