import axios from "axios";
import API_PATHS from "./apiPaths"


export const fetchMonths = async () => {
  try {
    let response= await axios.get(API_PATHS.FETCH_MONTHS)
    return response.data;
  } catch (error) {
    console.error("Error fetching months:", error);
    throw error;
  }
};

export const fetchSubjects = async () => {
  try {
    let response= await axios.get(API_PATHS.FETCH_SUBJECTS)
    return response.data;

  } catch (error) {
    console.error("Error fetching Subjects:", error);
    throw error;
  }
};

export const fetchUserData = async (userId) => {
  try {
    let response= await axios.get(`${API_PATHS.FETCH_USER_DATA}${userId}/`)
    return response.data;

  } catch (error) {
    console.error("Error Fetching  user data:", error);
    throw error;
  }
};


