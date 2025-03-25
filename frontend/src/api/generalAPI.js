import axios from "./axiosInstance";
import {GENERAL_API_ENDPOINTS,MEMBER_API_ENDPOINTS} from "./apiPaths"


export const fetchMonths = async () => {
  try {
    let response= await axios.get(GENERAL_API_ENDPOINTS.MONTHS)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSections = async () => {
  try {
    let response= await axios.get(GENERAL_API_ENDPOINTS.SECTIONS)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubjects = async () => {
  try {
    let response= await axios.get(GENERAL_API_ENDPOINTS.SUBJECTS)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserData = async (userId) => {
  try {
    let response= await axios.get(`${MEMBER_API_ENDPOINTS.MEMBERS}${userId}/`)
    return response.data;

  } catch (error) {
    throw error;
  }
};


