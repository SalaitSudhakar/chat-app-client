import { create } from "zustand";
import { api } from "../Config/axiosConfig";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  userData: null, // To check user loggin state
  isSigningUp: false, // To create loading animation during signUp
  isLoggingIn: false, // To create loading animation during login
  isUpdatingProfile: false, // Loading animation on profile page

  isCheckingAuth: true, // To track the below checkAuth state api call trigger

  /* Check user authenticated */
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

  /* Sign up API call */
  signup: async (data) => {
    // Set the singingup state to true
    set({ isSigningUp: true });
    try {
      const response = await api.post("/auth/signup", data); //API call

      const { userData, message} = response.data;

      toast.success(message || "Account Created Successfully");

      set({ userData: userData }); // Set user Data

      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something Went Wrong");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  /* Login */
  login: async (data) => {
    set({ isLoggingIn: true });

    console.log("Data from API call in Store: ", data)
    try {
      const response = await api.post("/auth/login", data);

      if (response && response.data) {
        const { userData, message } = response.data;
        set({ userData: userData || null });
        toast.success(message || "Login Successful");
        return true;
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (error) {
      toast.error(
        error?.response?.data?.error || error.message || "Something Went Wrong. Try Again!"
      );
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },


  /* Logout API call */
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      set({ userData: null });
      toast.success(response?.data?.message || "Logout Successfully");

      window.location = "/login";
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },
}));
