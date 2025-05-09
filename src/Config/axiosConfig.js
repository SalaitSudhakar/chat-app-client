import axios from "axios";

// Make sure VITE_BACKEND_URL exists and is properly formatted
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// Log the actual API URL when the app initializes for debugging
const API_BASE_URL = BACKEND_URL && `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
