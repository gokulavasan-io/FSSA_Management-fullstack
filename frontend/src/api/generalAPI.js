import axios from "axios";
import API_PATHS from "./apiPaths"


export const fetchMonths = async () => {
  try {
    let response= await axios.get(API_PATHS.FETCH_MONTHS)
    return response.data;
  } catch (error) {
    console.error("Error submitting test data:", error);
    throw error;
  }
};

export const fetchSubjects = async () => {
  try {
    let response= await axios.get(API_PATHS.FETCH_SUBJECTS)
    return response.data;

  } catch (error) {
    console.error("Error submitting test data:", error);
    throw error;
  }
};



