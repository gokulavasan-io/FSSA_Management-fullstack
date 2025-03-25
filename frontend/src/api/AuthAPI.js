import axiosInstance from "./axiosInstance";
import {AUTH_API_ENDPOINTS} from "./apiPaths"


export const fetchUserId = async () => {
    try {
      let response= await axiosInstance.get(AUTH_API_ENDPOINTS.USER_ID)
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const logout = async () => {
    try {
      let response= await axiosInstance.post(AUTH_API_ENDPOINTS.LOGOUT); 
      return 
    } catch (error) {
      throw error;
    }
};

export const login = async (token) => {
    try {
      let response= await axiosInstance.get(AUTH_API_ENDPOINTS.LOGIN,{token})
      return response.data;
    } catch (error) {
      throw error;
    }
};

