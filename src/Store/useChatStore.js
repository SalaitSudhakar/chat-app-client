import { create } from "zustand";
import { toast } from "react-hot-toast";
import { api } from "./../Config/axiosConfig";

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getUser: async () => {
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
    }
  },
}));
