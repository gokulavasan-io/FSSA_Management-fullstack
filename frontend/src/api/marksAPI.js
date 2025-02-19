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

export const fetchAllTestMarksForMonth = async (section,month,subject) => {
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

export const fetchTestDetails = async (month,subject) => {
  try {
    let response= await axios.get(`${API_PATHS.GET_ALL_TEST_DETAILS}?month=${month}&subject=${subject}`)
    return response.data;
  } catch (error) {
    console.error("Error submitting test data:", error);
    throw error;
  }
};

export const fetchTestData = async (testId) => {
  try {
    const apiUrl = `${API_PATHS.GET_MARK}${testId}/?section_id=${null}`
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

