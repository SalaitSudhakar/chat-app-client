import { create } from "zustand";
import { api } from "../Config/axiosConfig";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  userData: null, // To check user loggin state
  isSigningUp: false, // To create loading animation during signUp
  isLoggingIn: false, // To create loading animation during login
  isUpdatingProfilePic: false, // Loading animation on profile page
  isUpdatingProfileData: false, // Loading animation on profile page

  isCheckingAuth: true, // To track the below checkAuth state api call trigger

  /* Check user authenticated */
  checkAuth: async () => {
    try {
      const response = await api.get("/auth/check-authenticated");

      set({ userData: response.data.userData });
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

      const { userData, message } = response.data;

      toast.success(message || "Account Created Successfully");

      set({ userData: userData }); // Set user Data

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

  /* Login */
  login: async (data) => {
    set({ isLoggingIn: true });

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
        error?.response?.data?.message ||
          error.message ||
          "Something Went Wrong. Try Again!"
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

  /* Update profile pic */
  updateProfilePic: async (data) => {
    set({ isUpdatingProfilePic: true }); // set profile pic updating true

    // Method 1: Using forEach
    data.forEach((value, key) => {
      console.log(key, value);
    });
    
    try {
      const response = await api.patch("/user/update/profile-pic", data); // Update profile API call

      // destructure userdata and message
      const { userData, message } = response.data;

      // Set UserData
      set({ userData: userData });
      toast.success(message || "Profile Pic Updated Successfully");
      return true;
    } catch (error) {
      toast.error(
        error.response.data.message || "Error Updating Profile Pic. Try Again!"
      );
      return false;
    } finally {
      set({ isUpdatingProfilePic: false }); // Make false isUpdating profile pic state
    }
  },

  /* Update Profile Data */
  updateProfileData: async (data) => {
    set({ isUpdatingProfileData: true }); // set profile pic updating true

    try {
      const response = await api.put("/user/update/profile", data); // Update profile API call

      // destructure userdata and message
      const { userData, message } = response.data;

      // Set UserData
      set({ userData: userData });
      toast.success(message || "Profile Data Updated Successfully");
      return true;
    } catch (error) {
      toast.error(
        error.response.data.message || "Error Updating Profile data. Try Again!"
      );
      return false;
    } finally {
      set({ isUpdatingProfileData: false }); // Make false isUpdating profile pic state
    }
  },
}));
