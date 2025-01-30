import axios from "axios";
import API_PATHS from "./apiPaths"

export const submitTestData = async (testData) => {
  try {
    const response = await axios.post(`${API_PATHS.POST_MARK}`, testData);
    return response.data;
  } catch (error) {
    console.error("Error submitting test data:", error);
    throw error;
  }
};

export const fetchAllMarks = async (section,month,subject) => {
  try {
    let response= await axios.get(`${API_PATHS.GET_ALL_DATA}?section_id=${section}&month=${month}&subject=${subject}`)
    return response.data;
  } catch (error) {
    console.error("Error submitting test data:", error);
    throw error;
  }
};

export const updateMarks = async (testId,data) => {
  try {
    let response= await axios.put(`${API_PATHS.UPDATE_MARK}${testId}/`, data)
    return response.data;
  } catch (error) {
    console.error("Error submitting test data:", error);
    throw error;
  }
};







