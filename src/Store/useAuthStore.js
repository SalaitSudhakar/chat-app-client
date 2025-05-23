import { create } from "zustand";
import { api } from "../Config/axiosConfig";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Better handling of socket URL for different environments
const BASE_URL = import.meta.env.VITE_BACKEND_URL || window.location.origin;

export const useAuthStore = create((set, get) => ({
  userData: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfilePic: false,
  isUpdatingProfileData: false,
  onlineUsers: [],
  socket: null,
  socketConnected: false,

  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await api.get("/auth/check-authenticated");
      set({ userData: response.data.userData });
      get().connectSocket();
    } catch (error) {
      set({ userData: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await api.post("/auth/signup", data);
      const { userData, message } = response.data;

      toast.success(message || "Account Created Successfully");

      set({ userData });
      get().connectSocket();

      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something Went Wrong"
      );
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const response = await api.post("/auth/login", data);

      if (response && response.data) {
        const { userData, message } = response.data;

        set({ userData });
        toast.success(message || "Login Successful");
        get().connectSocket();
        return true;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something Went Wrong. Try Again!"
      );
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      set({ userData: null });
      toast.success(response?.data?.message || "Logout Successfully");
      get().disconnectSocket();
      window.location = "/login";
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },

  updateProfilePic: async (data) => {
    set({ isUpdatingProfilePic: true });

    try {
      const response = await api.patch("/user/update/profile-pic", data);
      const { userData, message } = response.data;

      set({ userData });
      toast.success(message || "Profile Pic Updated Successfully");
      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error Updating Profile Pic. Try Again!"
      );
      return false;
    } finally {
      set({ isUpdatingProfilePic: false });
    }
  },

  updateProfileData: async (data) => {
    set({ isUpdatingProfileData: true });

    try {
      const response = await api.put("/user/update/profile", data);
      const { userData, message } = response.data;

      set({ userData });
      toast.success(message || "Profile Data Updated Successfully");
      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Error Updating Profile data. Try Again!"
      );
      return false;
    } finally {
      set({ isUpdatingProfileData: false });
    }
  },

  connectSocket: () => {
    const { userData } = get();
    if (!userData || get().socket?.connected) {
      return;
    }

    try {
      const socket = io(BASE_URL, {
        query: { userId: userData._id },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => {
        set({ socketConnected: true });
      });

      socket.on("disconnect", () => {
        set({ socketConnected: false });
      });

      socket.on("connect_error", (error) => {
        toast.error("Connection to chat server failed. Retrying...");
      });

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });

      socket.on("userJoined", (newUserId) => {
        set((state) => {
          if (state.onlineUsers.includes(newUserId)) return state;
          return { onlineUsers: [...state.onlineUsers, newUserId] };
        });
      });

      socket.on("userLeft", (userId) => {
        set((state) => ({
          onlineUsers: state.onlineUsers.filter((id) => id !== userId),
        }));
      });

      set({ socket });
    } catch (error) {
      toast.error(error?.message || "Failed to connect to chat server");
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [], socketConnected: false });
    }
  },
}));
