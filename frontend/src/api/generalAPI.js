import axios from "./axiosInstance";
import { GENERAL_API_ENDPOINTS, MEMBER_API_ENDPOINTS } from "./apiPaths";

export const fetchMonths = async () => {
  let response = await axios.get(GENERAL_API_ENDPOINTS.MONTHS);
  return response.data;
};

export const fetchSections = async () => {
  let response = await axios.get(GENERAL_API_ENDPOINTS.SECTIONS);
  return response.data;
};

export const fetchSubjects = async () => {
  let response = await axios.get(GENERAL_API_ENDPOINTS.SUBJECTS);
  return response.data;
};

export const fetchUserData = async (userId) => {
  if (!userId) return;
  let response = await axios.get(`${MEMBER_API_ENDPOINTS.MEMBERS}${userId}/`);
  return response.data;
};
