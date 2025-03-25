import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  withCredentials: true, // Send cookies with requests
});

// Intercept responses to handle unauthorized cases
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 ||error.response?.status === 403  ) {
      console.log("Unauthorized request, clearing session...");
      localStorage.removeItem("userId"); 
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
