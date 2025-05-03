import { create } from "zustand";
import { api } from "../Config/axiosConfig";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  userData: null, // To check user loggin state
  isSigningUp: false, // To create loading animation during signUp
  isLoggingIn: false, // To create loading animation during login
  isUpdatingProfile: false, // Loading animation on profile page

  isCheckingAuth: true, // To track the below checkAuth state api call trigger

  checkAuth: async () => {
    try {
      const response = await api.get("/auth/check-authenticated");

      set({ userData: response.data });
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
      toast.success("Account Created Successfully");

      set({ userData: response.data });

      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
