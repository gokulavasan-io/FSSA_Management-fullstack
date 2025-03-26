import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  withCredentials: true, // Send cookies for each requests
});

// Intercept responses to handle unauthorized cases for each request
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized request !");
      localStorage.removeItem("userId"); 
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
