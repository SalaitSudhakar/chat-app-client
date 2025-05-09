import axios from "axios";

// Make sure VITE_BACKEND_URL exists and is properly formatted
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// Log the actual API URL when the app initializes for debugging
const API_BASE_URL = BACKEND_URL && `${BACKEND_URL}/api`;
console.log(`🔌 API configured with base URL: ${API_BASE_URL}`);

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request/response interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error(`❌ API Error ${error.response.status}: ${error.response.config.url}`);
      
      // Check if the response is HTML instead of JSON (possible 404 page)
      const contentType = error.response.headers['content-type'];
      if (contentType && contentType.includes('text/html')) {
        console.error("Received HTML response instead of JSON. Check your API URL configuration.");
        console.error("First 100 characters of response:", error.response.data.substring(0, 100));
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("❌ No response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("❌ Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);