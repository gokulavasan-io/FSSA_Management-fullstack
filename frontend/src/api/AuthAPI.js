import axiosInstance from "./axiosInstance";
import { AUTH_API_ENDPOINTS } from "./apiPaths";

export const fetchUserId = async () => {
  let response = await axiosInstance.get(AUTH_API_ENDPOINTS.USER_ID);
  return response.data;
};

export const logout = async () => {
  await axiosInstance.post(AUTH_API_ENDPOINTS.LOGOUT);
};

export const login = async (token) => {
  let response = await axiosInstance.post(AUTH_API_ENDPOINTS.LOGIN, { token });
  return response.data;
};
