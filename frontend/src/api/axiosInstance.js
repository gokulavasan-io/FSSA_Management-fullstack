import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // Send cookies with requests
});

// Intercept responses to handle unauthorized cases
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized request, clearing session...");
      localStorage.removeItem("userEmail"); // Clear session data
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
